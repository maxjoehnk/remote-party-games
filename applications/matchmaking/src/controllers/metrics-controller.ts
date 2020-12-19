import { Controller, Get, Header, HttpCode } from '@nestjs/common';
import { MatchmakingMetrics } from '../metrics/matchmaking';

@Controller('/api/metrics')
export class MetricsController {
  constructor(private matchmakingMetrics: MatchmakingMetrics) {}

  @Get()
  @HttpCode(200)
  @Header('Content-Type', 'text/plain')
  async getMetrics() {
    const metrics = await this.matchmakingMetrics.getMetrics();
    return metrics;
  }
}
