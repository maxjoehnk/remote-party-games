import { html, render } from 'https://unpkg.com/lit-html?module';

export const renderLobby = (container) => {
    const settings = {
        code: ''
    };

    render(lobby([], settings), container);
};

const lobby = (players, settings) => html`<div class="lobby">
    <div class="lobby__card lobby__card--settings card">
        <h2 class="subtitle">Lobby Settings</h2>
    </div>
    <div class="lobby__card lobby__card--players card">
        <h2 class="subtitle">Players</h2>
    </div>
    <div class="lobby__card lobby__card--invite card">
        <span>${settings.code}</span>
    </div>
</div>`;
