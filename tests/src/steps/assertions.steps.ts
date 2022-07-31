import { Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../world';
import { expect } from '@playwright/test';

Then('I see {string} in the Header', async function (this: ICustomWorld, expectation: string) {
  const locator = this.page!.locator(`.header >> text=${expectation}`)

  await expect(locator).toBeVisible();
})

Then('I see {string}', async function (this: ICustomWorld, expectation: string) {
  const locator = this.page!.locator(`text=${expectation}`)

  await expect(locator).toBeVisible();
})
