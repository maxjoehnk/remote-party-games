import { log } from './logging.mjs';
import { renderHome } from './routes/home.mjs';
import { renderLobby } from './routes/lobby.mjs';

const container = document.getElementById('app');

let currentRoute = window.location.pathname;

const routes = new Map();
routes.set('/', {
    title: 'Activity',
    render: renderHome
});
routes.set('/lobby/new', {
    title: 'New Lobby',
    render: renderLobby
});

export function navigate(url) {
    log(`[Router] Opening URL ${url}...`);
    currentRoute = url;
    renderCurrentRoute();
}

export function renderCurrentRoute() {
    const route = routes.get(currentRoute);
    renderRoute(route);
}

function renderRoute(route) {
    log(`[Router] Rendering route ${route.title}`);
    window.history.pushState(null, route.title, currentRoute);
    route.render(container);
}