import { Injectable, OnModuleInit } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { MessageQueue, SocketMessageEvent } from '../message-queue/message-queue';
import { GameTypes } from '../games/types';
import { GameConfiguration } from '../games/config';
import { Game } from '../contracts/game';
import { JoinLobbyCommand } from '../commands/join-lobby.command';
import { gameStartedSocketMsg, lobbyClosedSocketMsg } from './socket-messages';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { UpdateUsernameCommand } from '../commands/update-username.command';
import { StartGameCommand } from '../commands/start-game.command';
import { StopGameCommand } from '../commands/stop-game.command';
import { SwitchTeamCommand } from '../commands/switch-team.command';
import { GameActionCommand } from '../commands/game-action.command';
import { ChangeGameCommand } from '../commands/change-game.command';
import { ChangeGameConfigurationCommand } from '../commands/change-game-configuration.command';
import { PlayerDisconnectedEvent } from '../events/player-disconnected-event';

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

@Injectable()
export class SocketSubscribers implements OnModuleInit {
  constructor(
    private messageQueue: MessageQueue,
    private commandBus: CommandBus,
    private eventBus: EventBus
  ) {}

  async onModuleInit(): Promise<void> {
    await this.messageQueue.subscribe('lobby/join', this.onJoinLobby);
    await this.messageQueue.subscribe('user/username', this.onUpdateUsername);
    await this.messageQueue.subscribe('lobby/start-game', this.onStartGame);
    await this.messageQueue.subscribe('lobby/stop-game', this.onStopGame);
    await this.messageQueue.subscribe('lobby/switch-team', this.onSwitchTeam);
    await this.messageQueue.subscribe('lobby/change-game', this.onChangeGame);
    await this.messageQueue.subscribe('lobby/update-game-config', this.onChangeGameConfiguration);
    await this.messageQueue.subscribe('game/action', this.onGameAction);
    await this.messageQueue.subscribe('socket/disconnected', this.onDisconnect);
  }

  private onJoinLobby = async (event: SocketMessageEvent<JoinLobbyMessage>) => {
    try {
      const game: Game | null = await this.commandBus.execute(
        new JoinLobbyCommand(event.userId, event.message.code)
      );
      if (game == null) {
        return;
      }
      this.messageQueue.broadcast(
        {
          type: gameStartedSocketMsg,
          game: game.type,
          gameState: game.state,
        },
        [event.userId]
      );
    } catch (err) {
      console.error(err);
      this.messageQueue.broadcast(
        {
          type: lobbyClosedSocketMsg,
          code: event.message.code,
        },
        [event.userId]
      );
    }
  };

  private onUpdateUsername = async (event: SocketMessageEvent<UpdateUsernameMessage>) => {
    await this.commandBus.execute(new UpdateUsernameCommand(event.userId, event.message.username));
  };

  private onStartGame = async (event: SocketMessageEvent<void>) => {
    await this.commandBus.execute(new StartGameCommand(event.userId));
  };

  private onStopGame = async (event: SocketMessageEvent<void>) => {
    await this.commandBus.execute(new StopGameCommand(event.userId));
  };

  private onSwitchTeam = async (event: SocketMessageEvent<SwitchTeamMessage>) => {
    await this.commandBus.execute(new SwitchTeamCommand(event.userId, event.message.teamId));
  };

  private onGameAction = async (event: SocketMessageEvent<any>) => {
    await this.commandBus.execute(new GameActionCommand(event.userId, event.message));
  };

  private onChangeGame = async (event: SocketMessageEvent<ChangeGameMessage>) => {
    await this.commandBus.execute(new ChangeGameCommand(event.userId, event.message.game));
  };

  private onChangeGameConfiguration = async (
    event: SocketMessageEvent<ChangeGameConfigurationMessage>
  ) => {
    await this.commandBus.execute(
      new ChangeGameConfigurationCommand(event.userId, event.message.configuration)
    );
  };

  private onDisconnect = async (event: SocketMessageEvent<void>) => {
    this.eventBus.publish(new PlayerDisconnectedEvent(event.userId));
  };
}
