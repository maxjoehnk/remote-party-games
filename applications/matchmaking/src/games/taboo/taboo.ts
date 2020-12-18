import { Game } from '../../contracts/game';
import { TabooCard } from './taboo-card';
import { loadCards } from './card-loader';
import { Team } from '../../contracts/team';
import { SocketBroadcaster } from '../../sockets/socket-broadcaster';
import { TeamBasedScore } from '../../contracts/game-history';
import Timeout = NodeJS.Timeout;

enum TabooActionTypes {
  Timer = 'taboo/timer',
  Guess = 'taboo/guess',
  SkipCard = 'taboo/skip',
  Continue = 'taboo/continue'
}

enum TabooView {
  Explaining = 0,
  Guessing = 1,
  Observing = 2,
  Continue = 3
}

let cards: TabooCard[] = [
  {
    term: 'Valentines Day',
    taboo: [
      'February',
      'Heart',
      'Hallmark',
      'Cards',
      'Flowers'
    ]
  }
];

loadCards((err, c) => {
  if (err) {
    console.error(err);
    return;
  }
  cards = c;
});

interface GameConfig {
  timer: number;
  teamOne: Team;
  teamTwo: Team;
}

interface Action {
  actionType: TabooActionTypes;
}

export class Taboo implements Game {
  private config: GameConfig;
  private pastWords: string[] = [];
  private handlers = new Map<TabooActionTypes, (action: Action) => void>()
  private teamOnePoints = 0;
  private teamTwoPoints = 0;
  private currentTeam = 1;
  private teamOnePlayer = 0;
  private teamTwoPlayer = 0;
  private timeLeft: number;

  private timer: Timeout;

  private currentCard: TabooCard;

  constructor([teamOne, teamTwo]: Team[], private broadcaster: SocketBroadcaster) {
    this.config = {
      timer: 60,
      teamOne,
      teamTwo
    };
    this.handlers.set(TabooActionTypes.Timer, this.handleTimer);
    this.handlers.set(TabooActionTypes.SkipCard, this.nextCard);
    this.handlers.set(TabooActionTypes.Guess, this.guess);
    this.handlers.set(TabooActionTypes.Continue, this.continueGame);
    this.timeLeft = this.config.timer;
    this.nextCard();
  }

  get type(): string {
    return 'taboo';
  }

  get state() {
    return {
      teamOne: {
        players: this.config.teamOne.players,
        points: this.teamOnePoints
      },
      teamTwo: {
        players: this.config.teamTwo.players,
        points: this.teamTwoPoints
      },
      currentRound: {
        team: this.currentTeam,
        activePlayer: this.currentTeam === 1 ?
          this.config.teamOne.players[this.teamOnePlayer] :
          this.config.teamTwo.players[this.teamTwoPlayer],
        timeLeft: this.timeLeft
      },
      currentCard: this.currentCard
    };
  }

  async stop(): Promise<TeamBasedScore> {
    this.stopTimer();

    return {
      type: 'team-score',
      scores: {
        [this.config.teamOne.id]: this.teamOnePoints,
        [this.config.teamTwo.id]: this.teamTwoPoints,
      },
      winner: this.getWinner(),
      teams: [this.config.teamOne, this.config.teamTwo]
    };
  }

  private getWinner() {
    if (this.teamOnePoints > this.teamTwoPoints) {
      return this.config.teamOne.id;
    }else if (this.teamTwoPoints > this.teamOnePoints) {
      return this.config.teamTwo.id;
    }
    return null; // Draw
  }

  start(): Promise<void> {
    return this.startTimer();
  }

  execute(action: any): Promise<void> {
    const handler = this.handlers.get(action.actionType);
    if (handler == null) {
      console.warn(`[Taboo] No action handler for ${action.actionType}`);
      return;
    }
    handler(action);
    this.broadcast();
  }

  private async startTimer() {
    if (this.timer != null) {
      return;
    }
    this.timer = setInterval(() => {
      this.execute({
        actionType: TabooActionTypes.Timer
      });
    }, 1000);
  }

  private handleTimer = () => {
    this.timeLeft--;
    if (this.timeLeft < 0) {
      this.stopTimer();
      this.nextPlayer();
    }
  };

  private stopTimer() {
    if (this.timer == null) {
      return;
    }
    clearTimeout(this.timer);
    this.timer = null;
  }

  private nextPlayer = () => {
    this.timeLeft = this.config.timer;
    if (this.currentTeam === 1) {
      this.teamOnePlayer++;
      if (this.teamOnePlayer >= this.config.teamOne.players.length) {
        this.teamOnePlayer = 0;
      }
    } else {
      this.teamTwoPlayer++;
      if (this.teamTwoPlayer >= this.config.teamTwo.players.length) {
        this.teamTwoPlayer = 0;
      }
    }
    this.currentTeam = this.currentTeam === 1 ? 2 : 1;
    this.nextCard();
  }

  private continueGame = () => {
    return this.startTimer();
  }

  private guess = () => {
    if (this.currentTeam === 1) {
      this.teamOnePoints++;
    }else {
      this.teamTwoPoints++;
    }
    this.nextCard();
  }

  private nextCard = () => {
    if (this.currentCard != null) {
      this.pastWords.push(this.currentCard.term);
    }
    const availableCards = this.getAvailableCards();
    const nextCardIndex = Math.floor(Math.random() * Math.floor(availableCards.length - 1));
    this.currentCard = availableCards[nextCardIndex];
  }

  private getAvailableCards() {
    const availableCards = cards.filter(c => !this.pastWords.includes(c.term));
    if (availableCards.length === 0) {
      this.pastWords = [];
      return cards;
    }
    return availableCards;
  }

  private broadcast = () => {
    if (this.timer == null) {
      this.broadcastToNextPlayer(this.state);
      return;
    }
    this.broadcastToExplaining(this.state);
    this.broadcastToGuessing(this.state);
    this.broadcastToObserving(this.state);
  }

  private broadcastToNextPlayer = (state) => {
    const msg = {
      type: 'taboo/update',
      gameState: {
        teamOne: state.teamOne,
        teamTwo: state.teamTwo,
        currentRound: state.currentRound,
        view: TabooView.Continue,
        currentCard: state.currentCard
      }
    };
    this.broadcaster.broadcast(msg, (c, playerId) => playerId === state.currentRound.activePlayer);
  }

  private broadcastToExplaining = (state) => {
    const msg = {
      type: 'taboo/update',
      gameState: {
        teamOne: state.teamOne,
        teamTwo: state.teamTwo,
        currentRound: state.currentRound,
        view: TabooView.Explaining,
        currentCard: state.currentCard
      }
    };
    this.broadcaster.broadcast(msg, (c, playerId) => playerId === state.currentRound.activePlayer);
  }

  private broadcastToGuessing = (state) => {
    const msg = {
      type: 'taboo/update',
      gameState: {
        teamOne: state.teamOne,
        teamTwo: state.teamTwo,
        currentRound: state.currentRound,
        view: TabooView.Guessing,
        currentCard: null
      }
    };
    const currentTeam = state.currentRound.team === 1 ? state.teamOne.players : state.teamTwo.players;
    const allGuessingPlayers = currentTeam.filter(playerId => playerId !== state.currentRound.activePlayer);
    this.broadcaster.broadcast(msg, (c, playerId) => allGuessingPlayers.includes(playerId));
  }

  private broadcastToObserving = (state) => {
    const msg = {
      type: 'taboo/update',
      gameState: {
        teamOne: state.teamOne,
        teamTwo: state.teamTwo,
        currentRound: state.currentRound,
        view: TabooView.Observing,
        currentCard: state.currentCard
      }
    };
    const otherTeam = state.currentRound.team !== 1 ? state.teamOne.players : state.teamTwo.players;
    this.broadcaster.broadcast(msg, (c, playerId) => otherTeam.includes(playerId));
  }
}
