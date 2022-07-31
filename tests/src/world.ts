import { BrowserContext, Page } from '@playwright/test';
import { World } from '@cucumber/cucumber';

export interface ICustomWorld extends World {
  testName?: string;
  startTime?: Date;

  context?: BrowserContext;
  page?: Page;

  players: Player[];
  lobbyCode: string;
}

export interface Player {
  context: BrowserContext;
  page: Page;
  name: string;
}
