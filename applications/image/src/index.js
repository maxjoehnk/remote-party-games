import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import uuid from 'uuid';
import { getMetrics } from './metrics/index.js';
import { loggingMiddleware } from './middleware/logging.js';
import { metricMiddleware } from './middleware/metric.js';
import { prepareStorage, readImage, storeImage } from './storage.js';
import { announceImage } from './announcer.js';

const port = 8091;

async function init() {
  await prepareStorage();

  const app = express();
  app.set('etag', 'strong');
  app.use(helmet());
  app.use(loggingMiddleware);
  app.use(metricMiddleware);
  app.get('/api/image/:imageId', (req, res) => {
    const imageId = req.params.imageId;
    console.log(`[Image] Fetching Image for id ${imageId}`);

    readImage(imageId, res);
  });
  app.post('/api/image/user', (req, res, next) => {
    const userId = req.get('X-UserId');
    storeImage(userId, req)
      .then(() => announceImage(userId))
      .then(() => res.status(204).end())
      .catch(err => next(err));
  });
  app.post('/api/image', (req, res, next) => {
    const imageId = uuid.v4();
    storeImage(imageId, req)
      .then(() => res.status(200).json(imageId))
      .catch(err => next(err));
  });

  app.get('/api/metrics', (req, res) => {
    const metrics = getMetrics();
    res.status(200);
    res.contentType('text/plain');
    res.send(metrics);
  });

  const server = createServer(app);
  server.listen(port, () => console.log(`[HTTP] Listening on ${port}...`));
}

init().catch(err => console.error(err));
