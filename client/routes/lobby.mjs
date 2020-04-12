import { html, render } from 'https://unpkg.com/lit-html?module';
import { joinLobby } from '../api.mjs';
import { onStateChange, state } from '../store.mjs';

const CODE_REGEX = /code=(.{4})/;

const codeAccessor = () => {
    const params = window.location.search;
    const results = CODE_REGEX.exec(params);
    if (results == null) {
        return null;
    }
    return results[1];
};

export const renderLobby = (container) => {
    const code = codeAccessor();
    const settings = {
        code
    };
    joinLobby(code);
    // TODO: only while lobby is open
    onStateChange(({ players }) => {
        render(lobby(players, settings), container);
    });

    render(lobby(state.players, settings), container);
};

const lobby = (players, settings) => html`<div class="lobby">
    <div class="lobby__card lobby__card--settings card">
        <h2 class="subtitle">Lobby Settings</h2>
        <p><b>Code: </b> ${settings.code}</p>
        <button class="button button--primary">Start Game</button>
    </div>
    <div class="lobby__card lobby__card--players card">
        <h2 class="subtitle">Players</h2>
        <ul class="lobby__player-list">
            ${players.map(p => html`<li class="lobby__player-list-item">${p.name}</li>`)}
        </ul>
    </div>
</div>`;
