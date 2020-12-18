import { Injectable } from '@nestjs/common';
import { Team } from '../contracts/team';
import { Game } from '../contracts/game';
import { Taboo } from './taboo/taboo';
import { SocketGateway } from '../sockets/socket-gateway';

@Injectable()
export class GameFactory {
  constructor(private socketGateway: SocketGateway) {
  }

  createGame(gameType: string, teams: Team[]): Game {
    return new Taboo(teams, this.socketGateway);
  }
}
