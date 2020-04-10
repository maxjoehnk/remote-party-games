import express from 'express';
import { createServer } from 'http';
import { createLobby, getLobby } from './lobby-store.js';
import { asyncHandler } from './util.js';

const port = 8090;

const app = express();
const loggingMiddleware = (req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
};
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

const server = createServer(app);

server.listen(port, () => console.log(`[HTTP] Listening on ${port}...`));