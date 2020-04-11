import { html, render } from 'https://unpkg.com/lit-html?module';
import { joinLobby } from '../api.mjs';

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

    render(lobby([], settings), container);
};

const lobby = (players, settings) => html`<div class="lobby">
    <div class="lobby__card lobby__card--settings card">
        <h2 class="subtitle">Lobby Settings</h2>
        <button class="button button--primary">Start Game</button>
    </div>
    <div class="lobby__card lobby__card--players card">
        <h2 class="subtitle">Players</h2>
    </div>
    <div class="lobby__card lobby__card--invite card">
        <span>${settings.code}</span>
    </div>
</div>`;
