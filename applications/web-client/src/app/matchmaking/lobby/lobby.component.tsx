import React from 'react';
import PlayerList from '../player-list/player-list.component';
import { selectGameType, selectLobbyCode } from '../../../store/selectors/lobby';
import { useSelector } from 'react-redux';
import './lobby.component.css';
import i18n from 'es2015-i18n-tag';
import Button from '../../ui-elements/button/button.component';
import { changeGame, startGame } from '../matchmaking.api';
import { useNotification } from '../../ui-elements/notification';
import { useClipboard } from '../../ui-elements/clipboard';
import GameHistoryList from '../history/game-history-list.component';
import StadtLandFlussSettings from './settings/stadt-land-fluss-settings';
import TabooSettings from './settings/taboo-settings';
import { getGameName } from '../history/game-names';
import { withLobby } from '../lobby-loader';
import StillePostSettings from './settings/stille-post-settings';
import PictionarySettings from './settings/pictionary-settings';

export interface GameLobbyRouteParams {
  code: string;
}

const games = ['taboo', 'stadt-land-fluss', 'stille-post', 'pictionary'];

const GameLobby = () => {
  const code = useSelector(selectLobbyCode);
  const game = useSelector(selectGameType);
  return (
    <div className="lobby">
      <div className="lobby__card lobby__card--settings card">
        <h2 className="subtitle">{i18n`Lobby Settings`}</h2>
        <LobbySettingsGroup label={i18n`Room Code`}>{code}</LobbySettingsGroup>
        <LobbySettingsGroup label={i18n`Link`}>
          {`${window.location.origin}/lobby/${code}`}
        </LobbySettingsGroup>
        <LobbySettingsGroup label={i18n`Game`}>
          <select
            className="select lobby__game-selection"
            value={game}
            onChange={event => changeGame(event.target.value)}
          >
            {games.map(game => (
              <option key={game} value={game}>
                {getGameName(game)}
              </option>
            ))}
          </select>
        </LobbySettingsGroup>
        {game === 'taboo' && <TabooSettings />}
        {game === 'stadt-land-fluss' && <StadtLandFlussSettings />}
        {game === 'stille-post' && <StillePostSettings />}
        {game === 'pictionary' && <PictionarySettings />}
        <div style={{ flex: 1 }} />
        <Button
          onClick={() => startGame()}
          primary
          className="lobby__start-game-btn"
        >{i18n`Start Game`}</Button>
      </div>
      <PlayerList className="lobby__card" canChangeTeam={true} />
      <GameHistoryList className="lobby__card" />
    </div>
  );
};

export const LobbySettingsGroup = ({
  label,
  actions,
  children,
}: {
  label: string;
  actions?: any;
  children: any;
}) => {
  const notify = useNotification();
  const clipboard = useClipboard();
  const canCopy = typeof children === 'string';

  return (
    <div className="lobby__settings-group">
      <h3 className="lobby__settings-group-header">
        <span className="lobby__settings-group-title">{label}</span>
        {canCopy && (
          <button
            className="lobby__copy-btn"
            onClick={() => {
              clipboard.copy(children);
              notify(i18n`Copied to Clipboard!`);
            }}
          >{i18n`Copy`}</button>
        )}
        {actions}
      </h3>
      {children}
    </div>
  );
};

export default withLobby(GameLobby);
