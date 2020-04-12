import { html, render } from 'https://unpkg.com/lit-html?module';
import { createLobby, updateUsername } from '../api.mjs';
import { link } from '../components/link.mjs';
import { navigate } from '../router.mjs';
import { state } from '../store.mjs';

export const renderHome = (container) => {
    let code = null;

    const draw = () => render(home({ code, setCode, username: state.username, setUsername }), container);

    const setCode = c => {
        code = c.trim() == '' ? null : c;
        draw();
    };

    const setUsername = username => {
        state.username = username;
        updateUsername(username);
        draw();
    };

    draw();
};

const home = ({ code, setCode, username, setUsername }) =>
    html`<div class="home">
        <div class="home__card card">
            <h1 class="title">Activity</h1>
            <h2 class="subtitle">1. Username</h2>
            <input class="input" placeholder="Username" @input=${e => setUsername(e.target.value)}>
            <h2 class="subtitle">2. Lobby</h2>
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