import { Given, When } from '@cucumber/cucumber';
import { ICustomWorld } from '../world';
import config from '../config';
import { Page } from '@playwright/test';

Given('I open the page', async function(this: ICustomWorld) {
  const page = this.page!;
  await page.goto(config.baseUrl);
});

Given('I\'m logged in as {string}', async function(this: ICustomWorld, username: string) {
  await login(this.page!, username)
});

When('I enter {string} in the {string} field', async function(this: ICustomWorld, value: string, label: string) {
  await this.page!.locator(`text=${label}`).fill(value);
});

When('I click on {string}', async function(this: ICustomWorld, label: string) {
  const element = this.page!.locator(`text=${label} >> visible=true`);
  await element.click();
});

export async function login(page: Page, username: string) {
  await page.locator(`text=Username`).fill(username);
  await page.locator(`text=Save >> visible=true`).click();
}
