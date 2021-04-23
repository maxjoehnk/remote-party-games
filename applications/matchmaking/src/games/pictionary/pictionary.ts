import { Game } from '../../contracts/game';
import { PICTIONARY } from '../types';
import { GameScore, PlayerBasedScore } from '../../contracts/game-history';
import { CreateGameConfig } from '../factory';
import { ALWAYS_VISIBLE_LETTERS, LETTER_THRESHOLDS, PictionaryGameConfiguration } from './config';
import { SocketBroadcaster, SocketMessage } from '../../sockets/socket-broadcaster';
import { PlayerAccessor } from '../player-accessor';
import { Action, GameHandler } from '../game-handler';
import { loadWords } from './word-loader';
import { Player } from '../../contracts/player';
import { GamePhase, PictionaryGameState, PlayerRanking } from './contracts';
import { PictionaryRoundStateMessenger } from './state-messenger';
import {
  DrawAction,
  GuessWord,
  PictionaryActionTypes,
  PictionaryEventTypes,
  SelectWord,
} from './messages';
import { calculateRanking } from './scores';
import Timeout = NodeJS.Timeout;

interface ChatMessage {
  player: string;
  message: string;
}

interface CompletedRound {
  word: string;
  drawer: string;
  rankings: PlayerRanking[];
}

function getDefaultState(config: PictionaryGameConfiguration, player: string): PictionaryGameState {
  return {
    phase: GamePhase.SelectingWord,
    currentPlayer: player,
    currentWord: null,
    visibleLetters: [],
    timeLeft: config.timer,
    answers: [],
    availableWords: [],
    rankings: [],
  };
}

export class Pictionary implements Game {
  private readonly config: PictionaryGameConfiguration;
  private readonly handler = new GameHandler();
  private readonly stateMessenger: PictionaryRoundStateMessenger;
  private words: string[] = [];
  private timer: Timeout;
  private players: Player[] = [];
  private currentPlayerIndex: number = 0;
  private pastRounds: CompletedRound[] = [];
  private scores: PlayerRanking[] = [];

  state: PictionaryGameState;

  constructor(
    config: CreateGameConfig<PictionaryGameConfiguration>,
    private broadcaster: SocketBroadcaster,
    private playerAccessor: PlayerAccessor
  ) {
    this.stateMessenger = new PictionaryRoundStateMessenger(broadcaster);
    this.config = config.gameConfiguration;
    this.handler.add(PictionaryActionTypes.Draw, this.handleAddDrawing);
    this.handler.add(PictionaryActionTypes.SelectWord, this.handleSelectWord);
    this.handler.add(PictionaryActionTypes.Timer, this.handleTimer);
    this.handler.add(PictionaryActionTypes.Guess, this.handleGuess);
    this.handler.add(PictionaryActionTypes.NextRound, this.handleNextRound);
    this.state = null;
  }

  get currentPlayer(): string {
    return this.players[this.currentPlayerIndex].id;
  }

  get type() {
    return PICTIONARY;
  }

  execute(action: Action<PictionaryActionTypes>, playerId?: string): Promise<void> {
    return this.handler.execute(action, playerId);
  }

  private handleAddDrawing = async (action: DrawAction) => {
    await this.broadcast(
      {
        type: PictionaryEventTypes.ImageUpdate,
        drawing: action.actions,
      },
      this.players.map(p => p.id)
    );
  };

  private handleSelectWord = async (action: SelectWord) => {
    this.state.currentWord = action.word;
    this.state.phase = GamePhase.Running;
    await this.startTimer();
    await this.broadcastUpdate();
  };

  private handleTimer = async () => {
    this.state.timeLeft--;
    if (!(await this.checkRoundFinished())) {
      this.updateHints();
      await this.broadcastUpdate();
    }
  };

  private handleGuess = async (action: GuessWord, playerId: string) => {
    const message: ChatMessage = {
      player: playerId,
      message: action.message,
    };
    const word = this.state.currentWord.toLowerCase();
    const guess = action.message.toLowerCase();
    if (word === guess) {
      this.state.answers.push(playerId);
      await this.broadcastCorrectGuess(message, playerId);
      this.broadcaster.broadcast(
        {
          type: PictionaryEventTypes.GuessedRight,
        },
        [playerId]
      );
      await this.checkRoundFinished();
    } else {
      await this.broadcastChat(message);
    }
  };

  private handleNextRound = () => this.nextPlayer();

  private async checkRoundFinished(): Promise<boolean> {
    if (this.state.answers.length === this.players.length - 1 || this.state.timeLeft < 0) {
      this.stopTimer();
      this.state.rankings = calculateRanking(this.state, this.players);
      this.pastRounds.push({
        word: this.state.currentWord,
        rankings: this.state.rankings,
        drawer: this.state.currentPlayer,
      });
      this.updateScores();
      this.state.phase = GamePhase.Scores;
      await this.broadcastUpdate();
      return true;
    }
    return false;
  }

  private updateScores() {
    this.scores = this.pastRounds
      .flatMap(round => round.rankings)
      .reduce((rankings, ranking) => {
        const current = rankings.find(r => r.player === ranking.player);
        if (current == null) {
          return [...rankings, ranking];
        }
        current.points += ranking.points;
        return rankings;
      }, []);
    this.scores.sort((a, b) => b.points - a.points);
    this.broadcast(
      {
        type: PictionaryEventTypes.Scores,
        scores: this.scores,
      },
      this.players.map(p => p.id)
    );
  }

  private updateHints() {
    if (LETTER_THRESHOLDS.includes(this.state.timeLeft)) {
      this.state.visibleLetters.push(this.getNextHint());
    }
  }

  private getNextHint(): number {
    let letterIndex = -1;
    const upper = this.state.currentWord.length;
    while (letterIndex === -1) {
      letterIndex = Math.floor(Math.random() * Math.floor(upper));
      if (this.state.visibleLetters.includes(letterIndex)) {
        letterIndex = -1;
      }
      if (ALWAYS_VISIBLE_LETTERS.includes(this.state.currentWord[letterIndex])) {
        letterIndex = -1;
      }
    }
    return letterIndex;
  }

  private async nextPlayer() {
    this.currentPlayerIndex += 1;
    if (this.currentPlayerIndex >= this.players.length) {
      this.currentPlayerIndex = 0;
    }
    await this.startNextRound();
  }

  async start(): Promise<void> {
    this.words = await loadWords(this.config.wordLists);
    this.players = await this.playerAccessor.getPlayers();
    await this.startNextRound();
  }

  private startTimer() {
    if (this.timer != null) {
      return;
    }
    this.timer = setInterval(() => {
      this.execute({
        actionType: PictionaryActionTypes.Timer,
      });
    }, 1000);
  }

  private stopTimer() {
    if (this.timer == null) {
      return;
    }
    clearTimeout(this.timer);
    this.timer = null;
  }

  async stop(): Promise<GameScore> {
    this.stopTimer();
    const score: PlayerBasedScore = {
      type: 'player-score',
      scores: {},
      winner: this.scores[0].player,
    };
    for (const ranking of this.scores) {
      score.scores[ranking.player] = ranking.points;
    }

    return score;
  }

  private async startNextRound() {
    this.state = getDefaultState(this.config, this.currentPlayer);
    this.state.availableWords = this.getWords();
    await this.broadcastUpdate();
  }

  private getWords(): string[] {
    const words = this.words;
    const firstWord = Math.floor(Math.random() * Math.floor(words.length - 1));
    const secondWord = Math.floor(Math.random() * Math.floor(words.length - 1));
    const thirdWord = Math.floor(Math.random() * Math.floor(words.length - 1));

    return [words[firstWord], words[secondWord], words[thirdWord]];
  }

  private broadcastUpdate() {
    return this.stateMessenger.broadcastUpdate(this.state, this.players);
  }

  private async broadcastChat(message: ChatMessage) {
    this.broadcast(
      {
        type: PictionaryEventTypes.Chat,
        ...message,
      },
      this.players.map(p => p.id)
    );
  }

  private async broadcastCorrectGuess(message: ChatMessage, playerId: string) {
    this.broadcast(
      {
        type: PictionaryEventTypes.Chat,
        ...message,
      },
      [this.state.currentPlayer, playerId]
    );
  }

  private broadcast(message: SocketMessage, players: string[]) {
    this.broadcaster.broadcast(message, players);
  }
}
