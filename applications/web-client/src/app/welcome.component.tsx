import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './welcome.component.css';
import Button from './ui-elements/button/button.component';
import i18n from 'es2015-i18n-tag';
import * as matchmakingApi from './matchmaking/matchmaking.api';

const Welcome = () => {
    const [code, setCode] = useState();
    const history = useHistory();

    const createAndOpenLobby = async () => {
        try {
            const { code } = await matchmakingApi.createLobby();
            history.push(`/lobby/${code}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="home">
            <div className="home__card card">
                <h2 className="subtitle">{i18n`Connect to Lobby`}</h2>
                <Button onClick={() => createAndOpenLobby()} primary>{i18n`Create a Lobby`}</Button>
                <span>{i18n`or`}</span>
                <div className="home__join-game">
                    <input
                        className="input home__game-code-input"
                        placeholder={i18n`Enter Room Code`}
                        onInput={e => setCode(e.target.value)}
                    />
                    <Link
                        to={`/lobby/${(code || '').trim()}`}
                        className={`button ${code == null ? 'button--disabled' : ''}`}
                    >{i18n`Join a Lobby`}</Link>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
