import { Injectable } from '@nestjs/common';
import { Team } from '../contracts/team';
import { Game } from '../contracts/game';
import { Taboo } from './taboo/taboo';
import { SocketGateway } from '../sockets/socket-gateway';
import { GameTypes, STADT_LAND_FLUSS, TABOO } from './types';
import { Player } from '../contracts/player';
import { GameConfiguration } from './config';
import { TabooGameConfiguration } from './taboo/config';
import { StadtLandFluss } from './stadt-land-fluss/stadt-land-fluss';
import { StadtLandFlussGameConfiguration } from './stadt-land-fluss/config';
import { PlayerAccessor } from './player-accessor';

export interface CreateGameConfig<TConfig = GameConfiguration> {
  teams: Team[];
  players: Player[];
  gameConfiguration: TConfig;
}

@Injectable()
export class GameFactory {
  constructor(private socketGateway: SocketGateway) {}

  createGame(
    gameType: GameTypes,
    config: CreateGameConfig,
    playerAccessor: PlayerAccessor
  ): Game {
    if (isTaboo(gameType, config)) {
      return new Taboo(config, this.socketGateway);
    }
    if (isStadtLandFluss(gameType, config)) {
      return new StadtLandFluss(config, this.socketGateway, playerAccessor);
    }
  }
}

function isTaboo(
  gameType: GameTypes,
  config: CreateGameConfig
): config is CreateGameConfig<TabooGameConfiguration> {
  return gameType === TABOO;
}

function isStadtLandFluss(
  gameType: GameTypes,
  config: CreateGameConfig
): config is CreateGameConfig<StadtLandFlussGameConfiguration> {
  return gameType === STADT_LAND_FLUSS;
}
