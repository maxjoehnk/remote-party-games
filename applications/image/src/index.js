import express from 'express';
import { createServer } from 'http';
import { getMetrics } from './metrics/index.js';
import { loggingMiddleware } from './middleware/logging.js';
import { metricMiddleware } from './middleware/metric.js';
import helmet from 'helmet';
import { prepareStorage, readImage, storeImage } from './storage.js';

const port = 8091;

async function init() {
    await prepareStorage();

    const app = express();
    app.set('etag', 'strong');
    app.use(helmet());
    app.use(loggingMiddleware);
    app.use(metricMiddleware);
    app.get('/api/image/:userId', (req, res) => {
        const userId = req.params.userId;
        console.log(`[Image] Fetching User Image for user ${userId}`);

        readImage(userId, res)
    });
    app.post('/api/image', (req, res, next) => {
        const userId = req.get("X-UserId")
        storeImage(userId, req)
            .then(() => res.status(204).end())
            .catch(err => next(err))
    });

    app.get('/api/metrics', (req, res) => {
        const metrics = getMetrics();
        res.status(200);
        res.contentType('text/plain');
        res.send(metrics);
    })

    const server = createServer(app);
    server.listen(port, () => console.log(`[HTTP] Listening on ${port}...`));
}

init()
    .catch(err => console.error(err))