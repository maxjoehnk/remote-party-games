export interface StadtLandFlussConfiguration {
  columns: string[];
}

export interface StadtLandFlussGameState {
  letter: string;
  running: boolean;
  columns: string[];
  players: PlayerRoundState[];
}

interface PlayerRoundState {
  playerId: string;
  points: number;
  columns?: string[];
  scores?: number[];
  upvotes?: number[];
}
