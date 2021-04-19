import { Controller, Get } from '@nestjs/common';
import { UnleashService } from 'nestjs-unleash/dist/src/unleash/unleash.service';

const games = ['taboo', 'stadt-land-fluss', 'stille-post', 'pictionary'];

@Controller('/api/games')
export class GamesController {
  constructor(private unleash: UnleashService) {
  }

  @Get()
  getAvailableGames(): string[] {
    return games.filter(this.isEnabled.bind(this));
  }

  private isEnabled(game: string): boolean {
    return this.unleash.isEnabled(`game-${game}`);
  }
}
