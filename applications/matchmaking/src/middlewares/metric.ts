import * as onResponse from 'on-response';
import { Counter, Histogram } from 'prom-client';

const httpRequestsTotalCounter = new Counter({
  labelNames: ['method', 'status'],
  name: 'http_requests_total',
  help: 'Total HTTP Requests',
});

const httpDurationHistogram = new Histogram({
  name: 'http_request_duration',
  help: 'HTTP Request durations',
  labelNames: ['status'],
});

export const metricMiddleware = (req, res, next) => {
  // Don't count metric api calls
  if (req.url === '/api/metrics') {
    return next();
  }
  const start = Date.now();
  onResponse(req, res, () => {
    const duration = Date.now() - start;
    httpRequestsTotalCounter.inc(
      {
        method: req.method,
        status: res.statusCode,
      },
      1
    );
    httpDurationHistogram.observe(
      {
        status: res.statusCode,
      },
      duration
    );
  });
  next();
};
