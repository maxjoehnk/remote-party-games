import prometheus from 'prom-client';

prometheus.collectDefaultMetrics();

export function getMetrics() {
  return prometheus.register.metrics();
}
