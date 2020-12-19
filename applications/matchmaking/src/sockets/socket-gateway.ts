import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { JoinLobbyCommand } from '../commands/join-lobby.command';
import { Game } from '../contracts/game';
import { UpdateUsernameCommand } from '../commands/update-username.command';
import { parse } from 'url';
import * as WebSocket from 'ws';
import { StartGameCommand } from '../commands/start-game.command';
import { gameStartedSocketMsg, lobbyClosedSocketMsg } from './socket-messages';
import { StopGameCommand } from '../commands/stop-game.command';
import { SwitchTeamCommand } from '../commands/switch-team.command';
import { PlayerDisconnectedEvent } from '../events/player-disconnected-event';
import { GameActionCommand } from '../commands/game-action.command';
import { SocketBroadcaster } from './socket-broadcaster';
import { SocketMetrics } from '../metrics/socket';
import { GameTypes } from '../games/types';
import { ChangeGameCommand } from '../commands/change-game.command';
import { GameConfiguration } from '../games/config';
import { ChangeGameConfigurationCommand } from '../commands/change-game-configuration.command';

interface JoinLobbyMessage {
  code: string;
}

interface UpdateUsernameMessage {
  username: string;
}

interface SwitchTeamMessage {
  teamId: string;
}

interface ChangeGameMessage {
  game: GameTypes;
}

interface ChangeGameConfigurationMessage {
  configuration: GameConfiguration;
}

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayConnection<WebSocket>, OnGatewayDisconnect<WebSocket>, SocketBroadcaster {
  private sockets = new WeakMap<WebSocket, string>();

  @WebSocketServer()
  server: WebSocket.Server;

  constructor(
    private commandBus: CommandBus,
    private eventBus: EventBus,
    private socketMetrics: SocketMetrics
  ) {}

  @SubscribeMessage('lobby/join')
  async onJoinLobby(@ConnectedSocket() client: WebSocket, @MessageBody() msg: JoinLobbyMessage) {
    const playerId = this.getPlayerId(client);
    try {
      const game: Game | null = await this.commandBus.execute(
        new JoinLobbyCommand(playerId, msg.code)
      );
      if (game == null) {
        return;
      }
      return {
        type: gameStartedSocketMsg,
        game: game.type,
        gameState: game.state,
      };
    } catch (err) {
      console.error(err);
      return {
        type: lobbyClosedSocketMsg,
        code: msg.code,
      };
    }
  }

  @SubscribeMessage('user/username')
  async onUpdateUsername(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() msg: UpdateUsernameMessage
  ) {
    const playerId = this.getPlayerId(client);
    await this.commandBus.execute(new UpdateUsernameCommand(playerId, msg.username));
  }

  @SubscribeMessage('lobby/start-game')
  async onStartGame(@ConnectedSocket() client: WebSocket) {
    const playerId = this.getPlayerId(client);
    await this.commandBus.execute(new StartGameCommand(playerId));
  }

  @SubscribeMessage('lobby/stop-game')
  async onStopGame(@ConnectedSocket() client: WebSocket) {
    const playerId = this.getPlayerId(client);
    await this.commandBus.execute(new StopGameCommand(playerId));
  }

  @SubscribeMessage('lobby/switch-team')
  async onSwitchTeam(
    @ConnectedSocket() client: WebSocket,
    @MessageBody()
    msg: SwitchTeamMessage
  ) {
    const playerId = this.getPlayerId(client);
    await this.commandBus.execute(new SwitchTeamCommand(playerId, msg.teamId));
  }

  @SubscribeMessage('game/action')
  async onGameAction(@ConnectedSocket() client: WebSocket, @MessageBody() msg: any) {
    const playerId = this.getPlayerId(client);
    await this.commandBus.execute(new GameActionCommand(playerId, msg));
  }

  @SubscribeMessage('lobby/change-game')
  async onChangeGame(@ConnectedSocket() client: WebSocket, @MessageBody() msg: ChangeGameMessage) {
    const playerId = this.getPlayerId(client);
    await this.commandBus.execute(new ChangeGameCommand(playerId, msg.game));
  }

  @SubscribeMessage('lobby/update-game-config')
  async onChangeGameConfiguration(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() msg: ChangeGameConfigurationMessage
  ) {
    const playerId = this.getPlayerId(client);
    await this.commandBus.execute(new ChangeGameConfigurationCommand(playerId, msg.configuration));
  }

  handleConnection(client: WebSocket, msg: any) {
    const url = parse(msg.url, true);
    if (url.query.userId == null) {
      console.warn(`[Socket] Connection opened without user id`);
      return client.close();
    }
    const playerId = url.query.userId as string;

    console.log(`[Socket] Player ${playerId} joined`);

    this.sockets.set(client, playerId);
    this.socketMetrics.openSocketGauge.inc();
    client.addEventListener('message', () => this.socketMetrics.socketRecvMessageCounter.inc());
  }

  handleDisconnect(client: WebSocket) {
    const playerId = this.getPlayerId(client);
    this.sockets.delete(client);
    this.socketMetrics.openSocketGauge.dec();
    this.eventBus.publish(new PlayerDisconnectedEvent(playerId));
  }

  broadcast(msg: any, clientFilter: (ws: WebSocket, playerId: string) => boolean = () => true) {
    this.server.clients.forEach(ws => {
      const playerId = this.sockets.get(ws);
      if (!clientFilter(ws, playerId)) {
        return;
      }
      this.sendMessage(ws, msg);
    });
  }

  private sendMessage(ws: WebSocket, msg: any) {
    if (ws.readyState !== WebSocket.OPEN) {
      return;
    }
    ws.send(JSON.stringify(msg));
    this.socketMetrics.socketSentMessageCounter.inc();
  }

  private getPlayerId(client: WebSocket): string {
    return this.sockets.get(client);
  }
}
