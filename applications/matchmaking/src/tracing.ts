import { NodeSDK, tracing } from '@opentelemetry/sdk-node';
import { MeterProvider } from '@opentelemetry/sdk-metrics-base';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { AmqplibInstrumentation } from 'opentelemetry-instrumentation-amqplib';

export const meter = new MeterProvider({
  exporter: new PrometheusExporter({ port: 9464 }),
  interval: 1000,
});

const sdk = new NodeSDK({
  traceExporter: new tracing.ConsoleSpanExporter(),
  spanProcessor: new BatchSpanProcessor(
    new ZipkinExporter({
      serviceName: '@remote-party-games/matchmaking',
    })
  ),
  instrumentations: [
    new HttpInstrumentation(),
    new NestInstrumentation(),
    new AmqplibInstrumentation({}),
  ],
});

sdk.start();
