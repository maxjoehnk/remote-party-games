import React from 'react';
import PlayerList from './player-list.component';
import { selectLobbyCode } from '../../store/selectors/lobby';
import { connect, useSelector } from 'react-redux';
import './lobby.component.css';
import i18n from 'es2015-i18n-tag';
import { useParams } from 'react-router-dom';
import { joinLobby } from '../../store/actions/lobby';
import Button from '../ui-elements/button/button.component';
import { startGame } from './matchmaking.api';

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
                <p>
                    <b>{i18n`Room Code`}: </b> {code}
                </p>
                <p>
                    <b>Link:</b> {`${window.location.origin}/lobby/${code}`}
                </p>
                <p>
                    <b>{i18n`Game`}: </b>
                    <select>
                        <option value="taboo">{i18n`Taboo`}</option>
                    </select>
                </p>

                <Button
                    onClick={() => startGame()}
                    className="button button--primary"
                >{i18n`Start Game`}</Button>
            </div>
            <PlayerList className="lobby__card" canChangeTeam={true} />
        </div>
    );
};

export default connect()(LobbyLoader);
