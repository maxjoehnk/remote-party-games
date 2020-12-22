import { Game } from '../../contracts/game';
import { Action, GameHandler } from '../game-handler';
import { CreateGameConfig } from '../factory';
import { SocketBroadcaster, SocketMessage } from '../../sockets/socket-broadcaster';
import { PlayerAccessor } from '../player-accessor';
import { STILLE_POST } from '../types';
import { Player } from '../../contracts/player';
import { StillePostGameConfiguration, PageConfig, PageType } from './config';

enum StillePostActionTypes {
  FinishPage = 'stille-post/finish-page',
  OpenBook = 'stille-post/open-book',
  CloseBook = 'stille-post/close-book',
  ViewNextPage = 'stille-post/view-next-page',
}

enum StillePostEventTypes {
  NextPage = 'stille-post/next-page',
  AllBooksFinished = 'stille-post/books-finished',
  ViewBook = 'stille-post/view-book',
  BookClosed = 'stille-post/book-closed',
}

interface FinishPageAction extends Action<StillePostActionTypes.FinishPage> {
  bookId: string;
  content: string;
}

interface OpenBookAction extends Action<StillePostActionTypes.OpenBook> {
  bookId: string;
}

interface ViewNextPageAction extends Action<StillePostActionTypes.ViewNextPage> {
  bookId: string;
  currentPage: number;
}

interface ViewBookEvent {
  type: StillePostEventTypes.ViewBook;
  bookId: string;
  page: number;
}

interface Book {
  id: string;
  pages: Page[];
}

interface Page {
  playerId: string;
  type: PageType;
  content?: string;
}

export class StillePost implements Game {
  private readonly handler = new GameHandler();

  private books: Book[] = [];

  private config: StillePostGameConfiguration;

  constructor(
    config: CreateGameConfig<StillePostGameConfiguration>,
    private broadcaster: SocketBroadcaster,
    private playerAccessor: PlayerAccessor
  ) {
    this.config = config.gameConfiguration;
    this.handler.add(StillePostActionTypes.FinishPage, this.finishPage);
    this.handler.add(StillePostActionTypes.OpenBook, this.openBook);
    this.handler.add(StillePostActionTypes.CloseBook, this.closeBook);
    this.handler.add(StillePostActionTypes.ViewNextPage, this.viewNextPage);
  }

  get type() {
    return STILLE_POST;
  }

  get state() {
    return null;
  }

  start() {
    return this.startRound();
  }

  async stop() {
    return null;
  }

  async execute(action: Action<StillePostActionTypes>, playerId: string): Promise<void> {
    await this.handler.execute(action, playerId);
  }

  private async startRound() {
    const players = await this.playerAccessor.getPlayers();
    this.books = this.prepareBooks(players);
    console.dir(this.books, { depth: 10 });
    for (const player of players) {
      this.notifyPlayer(player.id);
    }
  }

  private finishPage = async (action: FinishPageAction, playerId: string) => {
    const book = this.books.find(b => b.id === action.bookId);
    const pageIndex = book.pages.findIndex(p => p.playerId === playerId);
    book.pages[pageIndex].content = action.content;
    const nextPlayer = book.pages[pageIndex + 1];
    if (nextPlayer != null) {
      this.notifyPlayer(nextPlayer.playerId, book.id);
    }
    await this.checkAllBooks();
  };

  private notifyPlayer = (playerId: string, bookId?: string) => {
    const current = this.currentPage(playerId, bookId);
    const previous = this.previousPageOfBook(current.bookId, playerId);
    if (previous != null && previous.content == null) {
      return;
    }
    const msg: SocketMessage = {
      type: StillePostEventTypes.NextPage,
      page: {
        type: current.page.type,
        bookId: current.bookId,
        previous,
      },
    };
    this.broadcaster.broadcast(msg, (ws, id) => id === playerId);
  };

  private currentPage(playerId: string, bookId: string = playerId): { bookId: string; page: Page } {
    const book = this.books.find(b => b.id === bookId);
    const page = book.pages.find(p => p.playerId === playerId);

    return { page, bookId };
  }

  private previousPageOfBook(bookId: string, playerId: string): Page {
    const book = this.books.find(b => b.id === bookId);
    const pageIndex = book.pages.findIndex(p => p.playerId === playerId);
    if (pageIndex === 0) {
      return null;
    }
    return book.pages[pageIndex - 1];
  }

  private openBook = async (action: OpenBookAction) => {
    const msg: ViewBookEvent = {
      type: StillePostEventTypes.ViewBook,
      bookId: action.bookId,
      page: 0,
    };
    await this.broadcastToLobby(msg);
  };

  private closeBook = async () => {
    await this.broadcastToLobby({
      type: StillePostEventTypes.BookClosed,
    });
  };

  private viewNextPage = async (action: ViewNextPageAction) => {
    const msg: ViewBookEvent = {
      type: StillePostEventTypes.ViewBook,
      bookId: action.bookId,
      page: action.currentPage + 1,
    };
    await this.broadcastToLobby(msg);
  };

  private prepareBooks(players: Player[]): Book[] {
    return players.map(player => {
      const playerIds = [player.id, ...players.map(p => p.id).filter(id => id !== player.id)];
      const firstPageType = this.getFirstPageType();

      return {
        id: player.id,
        pages: playerIds.map((playerId, page) => ({
          playerId,
          type: page === 0 ? firstPageType : this.getPageType(firstPageType, page),
        })),
      };
    });
  }
  private getFirstPageType(): PageType {
    if (this.config.firstPage !== PageConfig.Random) {
      return this.config.firstPage;
    }
    return StillePost.getRandomPageType();
  }

  private getPageType(firstPage: PageType, page: number): PageType {
    if (this.config.followingPages === PageConfig.Random) {
      return StillePost.getRandomPageType();
    }
    if (this.config.followingPages !== PageConfig.Alternate) {
      return this.config.followingPages;
    }
    if (page % 2 == 0) {
      return firstPage;
    }
    return StillePost.getAlternatePage(firstPage);
  }

  private static getAlternatePage(firstPage: PageType) {
    if (firstPage === PageType.Text) {
      return PageType.Draw;
    }
    return PageType.Text;
  }

  private static getRandomPageType() {
    return Math.random() >= 0.5 ? PageType.Draw : PageType.Text;
  }

  private async checkAllBooks() {
    for (const book of this.books) {
      const isFinished = book.pages.every(p => p.content != null);
      if (!isFinished) {
        return;
      }
    }
    const msg: SocketMessage = {
      type: StillePostEventTypes.AllBooksFinished,
      books: this.books,
    };
    await this.broadcastToLobby(msg);
  }

  private async broadcastToLobby(msg: SocketMessage) {
    const players = await this.playerAccessor.getPlayers();
    const playerIds = players.map(p => p.id);

    this.broadcaster.broadcast(msg, (ws, playerId) => playerIds.includes(playerId));
  }
}
