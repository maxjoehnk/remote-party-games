import { Injectable } from '@nestjs/common';
import { Team } from '../contracts/team';
import { Game } from '../contracts/game';
import { Taboo } from './taboo/taboo';
import { SocketGateway } from '../sockets/socket-gateway';
import { GameTypes, PICTIONARY, STADT_LAND_FLUSS, STILLE_POST, TABOO } from './types';
import { Player } from '../contracts/player';
import { GameConfiguration } from './config';
import { TabooGameConfiguration } from './taboo/config';
import { StadtLandFluss } from './stadt-land-fluss/stadt-land-fluss';
import { StadtLandFlussGameConfiguration } from './stadt-land-fluss/config';
import { PlayerAccessor } from './player-accessor';
import { StillePost } from './stille-post/stille-post';
import { StillePostGameConfiguration } from './stille-post/config';
import { PictionaryGameConfiguration } from './pictionary/config';
import { Pictionary } from './pictionary/pictionary';

export interface CreateGameConfig<TConfig = GameConfiguration> {
  teams: Team[];
  players: Player[];
  gameConfiguration: TConfig;
}

@Injectable()
export class GameFactory {
  constructor(private socketGateway: SocketGateway) {}

  createGame(gameType: GameTypes, config: CreateGameConfig, playerAccessor: PlayerAccessor): Game {
    if (isTaboo(gameType, config)) {
      return new Taboo(config, this.socketGateway);
    }
    if (isStadtLandFluss(gameType, config)) {
      return new StadtLandFluss(config, this.socketGateway, playerAccessor);
    }
    if (isStillePost(gameType, config)) {
      return new StillePost(config, this.socketGateway, playerAccessor);
    }
    if (isPictionary(gameType, config)) {
      return new Pictionary(config, this.socketGateway, playerAccessor);
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

function isStillePost(
  gameType: GameTypes,
  config: CreateGameConfig
): config is CreateGameConfig<StillePostGameConfiguration> {
  return gameType === STILLE_POST;
}

function isPictionary(
  gameType: GameTypes,
  config: CreateGameConfig
): config is CreateGameConfig<PictionaryGameConfiguration> {
  return gameType === PICTIONARY;
}
