import { Module } from '@nestjs/common';
import { LobbyStore } from './lobby-store';
import { CqrsModule } from '@nestjs/cqrs';
import { PlayerStore } from './player-store';
import { UpdateUsernameHandler } from './handler/update-username.handler';
import { JoinLobbyHandler } from './handler/join-lobby.handler';
import { GameFactory } from './games/factory';
import { LobbyController } from './controllers/lobby-controller';
import { LobbyPlayerChangedSubscriber } from './subscriber/lobby-player-changed-subscriber';
import { LobbyChangedSubscriber } from './subscriber/lobby-changed-subscriber';
import { LobbyBroadcaster } from './sockets/lobby-broadcaster';
import { StartGameHandler } from './handler/start-game.handler';
import { SwitchTeamHandler } from './handler/switch-team.handler';
import { StopGameHandler } from './handler/stop-game.handler';
import { PlayerDisconnectedSubscriber } from './subscriber/player-disconnected-subscriber';
import { GameActionHandler } from './handler/game-action.handler';
import { MetricsController } from './controllers/metrics-controller';
import { MatchmakingMetrics } from './metrics/matchmaking';
import { EventBusMetrics } from './metrics/event-bus';
import { ChangeGameHandler } from './handler/change-game.handler';
import { ChangeGameConfigurationHandler } from './handler/change-game-configuration.handler';
import { PlayerController } from './controllers/player-controller';
import { UpdateUserImageHandler } from './handler/update-user-image.handler';
import { UnleashModule } from 'nestjs-unleash';
import { GamesController } from './controllers/games-controller';
import { SocketBroadcaster } from './sockets/socket-broadcaster';
import { MessageQueue } from './message-queue/message-queue';
import { SocketSubscribers } from './sockets/subscribers';

@Module({
  imports: [
    CqrsModule,
    UnleashModule.forRoot({
      url: process.env.UNLEASH_URL,
      instanceId: process.env.UNLEASH_INSTANCE_ID,
      appName: process.env.UNLEASH_ENVIRONMENT,
    }),
  ],
  controllers: [LobbyController, MetricsController, PlayerController, GamesController],
  providers: [
    LobbyStore,
    PlayerStore,
    LobbyBroadcaster,
    MessageQueue,
    {
      provide: SocketBroadcaster,
      useExisting: MessageQueue,
    },
    SocketSubscribers,
    GameFactory,
    MatchmakingMetrics,
    EventBusMetrics,
    GameActionHandler,
    JoinLobbyHandler,
    StartGameHandler,
    StopGameHandler,
    SwitchTeamHandler,
    UpdateUsernameHandler,
    UpdateUserImageHandler,
    ChangeGameHandler,
    ChangeGameConfigurationHandler,
    LobbyPlayerChangedSubscriber,
    LobbyChangedSubscriber,
    PlayerDisconnectedSubscriber,
  ],
})
export class AppModule {}
