import { NodeSDK } from '@opentelemetry/sdk-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { MeterProvider } from '@opentelemetry/sdk-metrics-base';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { AmqplibInstrumentation } from 'opentelemetry-instrumentation-amqplib';
import { trace } from '@opentelemetry/api';

export const meter = new MeterProvider({
  exporter: new PrometheusExporter({ port: 9465 }),
  interval: 1000,
});

const sdk = new NodeSDK({
  traceExporter: new ZipkinExporter({
    serviceName: '@remote-party-games/socks',
  }),
  instrumentations: [
    new HttpInstrumentation(),
    new NestInstrumentation(),
    new AmqplibInstrumentation({}),
  ],
});

sdk.start();

export const tracer = trace.getTracer('@remote-party-games/socks');
