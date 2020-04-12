import { html, render } from 'https://unpkg.com/lit-html?module';
import { state } from '../store.mjs';

export const renderGame = container => {
    render(game(), container)
};

const game = () => html`
    <div class="card">
        <h2>Players</h2>
        <ul>
            ${state.players.map(p => html`<li>${p.name}</li>`)}
        </ul>
    </div>
    ${drawingMode()}
`;

const drawingMode = () => html`
    <div class="card">
        <h2>Dein cooles Wort</h2>
    </div>
`;

const drawingViewer = () => html``;