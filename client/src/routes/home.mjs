import { html, render } from 'https://unpkg.com/lit-html?module';
import { link } from '../components/link.mjs';

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
            ${link({ href: '/lobby/new', label: 'Create a Game', className: 'button--primary' })}
            <span>or</span>
            ${joinGame(code, e => setCode(e.target.value))}
        </div>
    </div>`;

const joinGame = (code, setCode) =>
    html`
        <div class="home__join-game">
            <input class="input home__game-code-input" placeholder="Room Code" @input=${setCode}>
            ${link({ href: `/lobby/${code}`, disabled: code == null, label: 'Join a Game' })}
        </div>
    `;
