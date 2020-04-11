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
routes.set('/lobby', {
    title: 'Lobby',
    render: renderLobby
});

export function navigate(url) {
    log(`[Router] Opening URL ${url}...`);
    currentRoute = url;
    const route = getCurrentRoute();
    pushHistory(route);
    renderRoute(route);
}

function getCurrentRoute() {
    const url = new URL(currentRoute, window.location.origin);
    return routes.get(url.pathname);
}

function pushHistory(route) {
    window.history.pushState(null, route.title, currentRoute);
}

export function renderCurrentRoute() {
    const route = getCurrentRoute();
    renderRoute(route);
}


function renderRoute(route) {
    log(`[Router] Rendering route ${route.title}`);
    route.render(container);
}