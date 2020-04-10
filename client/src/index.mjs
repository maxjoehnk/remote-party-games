import { log } from './logging.mjs';
import { renderCurrentRoute } from './router.mjs';

export function init() {
    log('Initializing...');
    renderCurrentRoute();
}

init();
