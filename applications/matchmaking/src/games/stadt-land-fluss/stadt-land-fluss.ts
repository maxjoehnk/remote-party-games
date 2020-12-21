import { Game } from '../../contracts/game';
import { Action, GameHandler } from '../game-handler';
import { STADT_LAND_FLUSS } from '../types';
import { PlayerBasedScore } from '../../contracts/game-history';
import { randomInt } from 'crypto';
import { CreateGameConfig } from '../factory';
import { SocketBroadcaster } from '../../sockets/socket-broadcaster';
import { PlayerAccessor } from '../player-accessor';
import { StadtLandFlussGameConfiguration } from './config';
import { Player } from '../../contracts/player';

const LETTERS: string[] = 'ABCDEFGHIJKLMNOPQRSTUVXYZ'.split('');

enum StadtLandFlussActionTypes {
  SubmitWord = 'stadt-land-fluss/submit-word',
  StartRound = 'stadt-land-fluss/start-round',
  StopRound = 'stadt-land-fluss/stop-round',
  DenyWord = 'stadt-land-fluss/deny-word',
  UpvoteWord = 'stadt-land-fluss/upvote-word',
}

enum StadtLandFlussEventTypes {
  RoundStarted = 'stadt-land-fluss/round-started',
  RoundFinished = 'stadt-land-fluss/round-finished',
  ScoreUpdated = 'stadt-land-fluss/score-updated',
}

interface Round {
  running: boolean;
  letter: string;
  players: PlayerRoundState[];
}

interface PlayerRoundState {
  playerId: string;
  columns?: string[];
  scores?: number[];
  upvotes?: number[];
  points: number;
}

interface SubmitWord extends Action<StadtLandFlussActionTypes.SubmitWord> {
  column: number;
  value: string;
}

interface DenyWord extends Action<StadtLandFlussActionTypes.DenyWord> {
  column: number;
  playerId: string;
}

interface UpvoteWord extends Action<StadtLandFlussActionTypes.UpvoteWord> {
  column: number;
  playerId: string;
}

const SINGLE_ANSWER_POINTS = 20;
const UNIQUE_ANSWER_POINTS = 10;
const DEFAULT_ANSWER_POINTS = 5;
const POINTS_PER_UPVOTE = 5;

export class StadtLandFluss implements Game {
  private readonly handler = new GameHandler();
  private readonly pastRounds: Round[] = [];
  private readonly pastLetters: string[] = [];
  private readonly config: StadtLandFlussGameConfiguration;

  private currentRound: Round;

  constructor(
    config: CreateGameConfig<StadtLandFlussGameConfiguration>,
    private broadcaster: SocketBroadcaster,
    private playerAccessor: PlayerAccessor
  ) {
    this.config = config.gameConfiguration;
    this.handler.add(StadtLandFlussActionTypes.SubmitWord, this.submitWord);
    this.handler.add(StadtLandFlussActionTypes.StartRound, this.startRound);
    this.handler.add(StadtLandFlussActionTypes.StopRound, this.stopRound);
    this.handler.add(StadtLandFlussActionTypes.DenyWord, this.denyWord);
    this.handler.add(StadtLandFlussActionTypes.UpvoteWord, this.upvoteWord);
  }

  get type() {
    return STADT_LAND_FLUSS;
  }

  get state() {
    if (this.currentRound.running) {
      return {
        letter: this.currentRound.letter,
        columns: this.config.columns,
        running: this.currentRound.running,
        players: this.currentRound.players.map(p => ({
          playerId: p.playerId,
          points: p.points,
        })),
      };
    }
    return {
      ...this.currentRound,
      columns: this.config.columns,
    };
  }

  execute(action: Action<StadtLandFlussActionTypes>, playerId: string): Promise<void> {
    return this.handler.execute(action, playerId);
  }

  async start(): Promise<void> {
    await this.startRound();
  }

  async stop(): Promise<PlayerBasedScore> {
    this.closePreviousRound();
    const players = new Set<string>();
    for (const round of this.pastRounds) {
      for (const player of round.players) {
        players.add(player.playerId);
      }
    }
    const scores = {};
    let winner = null;
    let winnerPoints = -1;
    for (const playerId of players) {
      const score = this.getPlayerScore(this.pastRounds, playerId);
      scores[playerId] = score;
      if (score > winnerPoints) {
        winner = playerId;
        winnerPoints = score;
      } else if (score === winnerPoints) {
        winnerPoints = Number.MAX_VALUE;
        winner = null;
      }
    }
    const score: PlayerBasedScore = {
      type: 'player-score',
      scores,
      winner,
    };
    return score;
  }

  private getPlayerScore(rounds: Round[], playerId: string): number {
    return rounds
      .filter(r => r.players.some(p => p.playerId === playerId))
      .flatMap(r => r.players.find(p => p.playerId === playerId).scores)
      .reduce((a, b) => a + b, 0);
  }

  private startRound = async () => {
    if (this.currentRound?.running) {
      return;
    }
    this.closePreviousRound();
    const players = await this.playerAccessor.getPlayers();
    const letter = this.nextLetter();
    const round: Round = {
      running: true,
      letter,
      players: players.map(this.getDefaultRoundState),
    };
    this.currentRound = round;
    this.broadcaster.broadcast({
      type: StadtLandFlussEventTypes.RoundStarted,
      gameState: this.state,
    });
  };

  private closePreviousRound() {
    if (this.currentRound == null || this.currentRound.running === true) {
      return;
    }
    this.pastLetters.push(this.currentRound.letter);
    this.pastRounds.push(this.currentRound);
    this.currentRound = null;
  }

  private getDefaultRoundState = (player: Player): PlayerRoundState => {
    return {
      playerId: player.id,
      columns: this.config.columns.map(() => ''),
      upvotes: this.config.columns.map(() => 0),
      points: this.getPlayerScore(this.pastRounds, player.id),
    };
  };

  private stopRound = () => {
    if (this.currentRound?.running === false) {
      return;
    }
    this.calculateScores();
    this.currentRound.running = false;
    this.broadcaster.broadcast({
      type: StadtLandFlussEventTypes.RoundFinished,
      gameState: this.state,
    });
  };

  private denyWord = (action: DenyWord, playerId: string) => {
    if (playerId === action.playerId) {
      return;
    }
    const state = this.currentRound.players.find(p => p.playerId === action.playerId);
    state.columns[action.column] = '';
    state.upvotes[action.column] = 0;
    this.calculateScores();
    this.broadcaster.broadcast({
      type: StadtLandFlussEventTypes.ScoreUpdated,
      gameState: this.state,
    });
  };

  private upvoteWord = (action: UpvoteWord, playerId: string) => {
    if (playerId === action.playerId) {
      return;
    }
    const state = this.currentRound.players.find(p => p.playerId === action.playerId);
    state.upvotes[action.column]++;
    this.calculateScores();
    this.broadcaster.broadcast({
      type: StadtLandFlussEventTypes.ScoreUpdated,
      gameState: this.state,
    });
  };

  private calculateScores() {
    this.prepareScores();
    for (let i = 0; i < this.config.columns.length; i++) {
      const words = this.getWordCounts(i);
      this.applyPoints(i, words);
    }
    this.updatePoints();
  }

  private prepareScores() {
    for (const player of this.currentRound.players) {
      player.scores = this.config.columns.map(() => 0);
    }
  }

  private getWordCounts(i: number): Map<string, number> {
    const words = new Map<string, number>();
    for (const player of this.currentRound.players) {
      const word = player.columns[i].toLowerCase().trim();
      if (!isValid(word, this.currentRound.letter)) {
        continue;
      }
      const count = words.get(word);
      if (count == null) {
        words.set(word, 1);
      } else {
        words.set(word, count + 1);
      }
    }
    return words;
  }

  private applyPoints(i: number, words: Map<string, number>) {
    for (const player of this.currentRound.players) {
      const word = player.columns[i].toLowerCase().trim();
      if (!isValid(word, this.currentRound.letter)) {
        continue;
      }
      const count = words.get(word);
      if (words.size === 1 && count === 1) {
        player.scores[i] = SINGLE_ANSWER_POINTS;
      } else if (count === 1) {
        player.scores[i] = UNIQUE_ANSWER_POINTS;
      } else {
        player.scores[i] = DEFAULT_ANSWER_POINTS;
      }
      player.scores[i] += player.upvotes[i] * POINTS_PER_UPVOTE;
    }
  }

  private updatePoints() {
    for (const player of this.currentRound.players) {
      player.points = this.getPlayerScore([...this.pastRounds, this.currentRound], player.playerId);
    }
  }

  private submitWord = async (action: SubmitWord, playerId) => {
    const playerState = await this.getPlayerState(playerId);
    playerState.columns[action.column] = action.value;
  };

  private async getPlayerState(playerId) {
    let playerState = this.currentRound.players.find(p => p.playerId === playerId);
    if (playerState == null) {
      playerState = await this.getNewPlayerState(playerId);
      this.currentRound.players.push(playerState);
    }

    return playerState;
  }

  private async getNewPlayerState(playerId: string) {
    const players = await this.playerAccessor.getPlayers();
    const player = players.find(p => p.id === playerId);

    return this.getDefaultRoundState(player);
  }

  private nextLetter(): string {
    const availableLetters = LETTERS.filter(letter => !this.pastLetters.includes(letter));
    const index = randomInt(availableLetters.length - 1);

    return availableLetters[index];
  }
}

const isValid = (value: string, letter: string): boolean => {
  return value != null && value.length > 1 && value[0] === letter.toLowerCase();
};
