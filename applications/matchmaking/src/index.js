import express from 'express';
import { createServer } from 'http';
import { createLobby, getLobby } from './lobby-store.js';
import { loggingMiddleware } from './middleware/logging.js';
import { setupSocketServer } from './socket.js';
import { setupSubscribers } from './subscribers/index.js';
import { asyncHandler } from './util.js';

const port = 8090;

const app = express();
app.use(loggingMiddleware);
app.get('/api/lobby/:code', (req, res) => {
    const code = req.params.code;
    console.log(`[Lobby] Fetching Lobby ${code}`);
    const lobby = getLobby(code);

    return res.json(lobby);
});
app.post('/api/lobby', asyncHandler(async (req, res) => {
    const lobby = await createLobby();
    console.log('[Lobby] Created new lobby', lobby);

    return res.json(lobby);
}));
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: clientFolder });
});

const server = createServer(app);
setupSocketServer(server);
setupSubscribers();
server.listen(port, () => console.log(`[HTTP] Listening on ${port}...`));