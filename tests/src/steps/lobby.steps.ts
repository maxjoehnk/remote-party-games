import { Given, When } from '@cucumber/cucumber';
import { ICustomWorld, Player } from '../world';
import config from '../config';
import { createBackgroundContext } from '../setup';
import { Page } from '@playwright/test';
import { login } from './navigator.steps';

Given('An existing Lobby with {int} Players', async function(this: ICustomWorld, playerCount: number) {
  const players = []

  for (let i = 0; i < playerCount; i++) {
    const context = await createBackgroundContext()
    const page = await context.newPage()
    await page.goto(config.baseUrl)

    const player: Player = {
      context,
      page,
      name: `Player ${i + 1}`
    };
    await login(player.page, player.name)
    players.push(player)
  }
  this.players = players
  this.lobbyCode = await createLobby(this.players[0].page)
  for (let i = 1; i < playerCount; i++) {
    const player = this.players[i]
    await joinLobby(player.page, this.lobbyCode!)
  }
});

When('I join the Lobby', async function(this: ICustomWorld) {
  await joinLobby(this.page!, this.lobbyCode!)
})

async function createLobby(page: Page): Promise<string> {
  await page.locator(`text=Create a Lobby`).click();
  return await page.locator(`data-testid=lobby-code`).innerText()
}

async function joinLobby(page: Page, lobbyCode: string): Promise<void> {
  await page.locator(`[placeholder="Enter Room Code"]`).fill(lobbyCode)
  await page.locator(`text=Join a Lobby`).click()
}
