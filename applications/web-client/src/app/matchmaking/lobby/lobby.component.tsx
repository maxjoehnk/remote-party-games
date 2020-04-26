import React from 'react';
import PlayerList from '../player-list/player-list.component';
import { selectLobbyCode } from '../../../store/selectors/lobby';
import { connect, useSelector } from 'react-redux';
import './lobby.component.css';
import i18n from 'es2015-i18n-tag';
import { useParams } from 'react-router-dom';
import { joinLobby } from '../../../store/actions/lobby';
import Button from '../../ui-elements/button/button.component';
import { startGame } from '../matchmaking.api';
import { useNotification } from '../../ui-elements/notification';
import { useClipboard } from '../../ui-elements/clipboard';

const LobbyLoader = ({ dispatch }) => {
    const { code } = useParams();
    dispatch(joinLobby(code));

    return <GameLobby />;
};

const GameLobby = () => {
    const code = useSelector(selectLobbyCode);
    return (
        <div className="lobby">
            <div className="lobby__card lobby__card--settings card">
                <h2 className="subtitle">{i18n`Lobby Settings`}</h2>
                <LobbySettingsGroup label={i18n`Room Code`}>{code}</LobbySettingsGroup>
                <LobbySettingsGroup label={i18n`Link`}>
                    {`${window.location.origin}/lobby/${code}`}
                </LobbySettingsGroup>
                <LobbySettingsGroup label={i18n`Game`}>
                    <select className="select lobby__game-selection">
                        <option value="taboo">{i18n`Taboo`}</option>
                    </select>
                </LobbySettingsGroup>
                <div style={{ flex: 1 }} />
                <Button
                    onClick={() => startGame()}
                    primary
                    className="lobby__start-game-btn"
                >{i18n`Start Game`}</Button>
            </div>
            <PlayerList className="lobby__card" canChangeTeam={true} />
        </div>
    );
};

const LobbySettingsGroup = ({ label, children }) => {
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
            </h3>
            {children}
        </div>
    );
};

export default connect()(LobbyLoader);
