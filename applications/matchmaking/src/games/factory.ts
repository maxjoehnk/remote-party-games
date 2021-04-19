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
import { UnleashService } from 'nestjs-unleash/dist/src/unleash/unleash.service';

export interface CreateGameConfig<TConfig = GameConfiguration> {
  teams: Team[];
  players: Player[];
  gameConfiguration: TConfig;
}

@Injectable()
export class GameFactory {
  constructor(private socketGateway: SocketGateway, private unleash: UnleashService) {}

  createGame(gameType: GameTypes, config: CreateGameConfig, playerAccessor: PlayerAccessor): Game {
    if (isTaboo(gameType, config) && this.isEnabled('taboo')) {
      return new Taboo(config, this.socketGateway);
    }
    if (isStadtLandFluss(gameType, config) && this.isEnabled('stadt-land-fluss')) {
      return new StadtLandFluss(config, this.socketGateway, playerAccessor);
    }
    if (isStillePost(gameType, config) && this.isEnabled('stille-post')) {
      return new StillePost(config, this.socketGateway, playerAccessor);
    }
    if (isPictionary(gameType, config) && this.isEnabled('pictionary')) {
      return new Pictionary(config, this.socketGateway, playerAccessor);
    }
  }

  private isEnabled(game: string): boolean {
    return this.unleash.isEnabled(`game-${game}`);
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
