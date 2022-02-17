import { Controller, Get, Header, HttpCode } from '@nestjs/common';
import { SocketMetrics } from '../metrics/socket';

@Controller('/api/metrics')
export class MetricsController {
  constructor(private metrics: SocketMetrics) {}

  @Get()
  @HttpCode(200)
  @Header('Content-Type', 'text/plain')
  async getMetrics() {
    const metrics = await this.metrics.getMetrics();
    return metrics;
  }
}
