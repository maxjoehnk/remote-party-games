import { html, render } from 'https://unpkg.com/lit-html?module';
import { createLobby } from '../api.mjs';
import { link } from '../components/link.mjs';
import { navigate } from '../router.mjs';

export const renderHome = (container) => {
    let code = null;

    const setCode = c => {
        code = c.trim() == '' ? null : c;
        render(home(code, setCode), container);
    };

    render(home(code, setCode), container);
};

const home = (code, setCode) =>
    html`<div class="home">
        <div class="home__card card">
            <h1 class="title">Activity</h1>
            <button @click=${() => createAndOpenLobby()} class="button button--primary">Create a Game</button>
            <span>or</span>
            ${joinGame(code, e => setCode(e.target.value))}
        </div>
    </div>`;

const joinGame = (code, setCode) =>
    html`
        <div class="home__join-game">
            <input class="input home__game-code-input" placeholder="Room Code" @input=${setCode}>
            ${link(`/lobby?code=${code}`, { disabled: code == null, label: 'Join a Game' })}
        </div>
    `;

const createAndOpenLobby = async() => {
    const lobby = await createLobby();
    navigate(`/lobby?code=${lobby.code}`);
};