import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  ITestCaseHookParameter,
  Status
} from '@cucumber/cucumber';
import { ICustomWorld } from './world';
import {
  BrowserContext,
  chromium,
  ChromiumBrowser,
  ConsoleMessage,
  firefox,
  FirefoxBrowser,
  webkit,
  WebKitBrowser
} from '@playwright/test';
import config from './config';

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
const tracesDir = 'traces';

BeforeAll(async function() {
  if (config.browser === 'firefox') {
    browser = await firefox.launch()
  }else if (config.browser === 'webkit') {
    browser = await webkit.launch()
  }else {
    browser = await chromium.launch();
  }
});

Before(async function(this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: config.video ? { dir: 'videos' } : undefined,
    viewport: { width: 1920, height: 1080 }
  });
  await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();
  this.page.on('console', async (msg: ConsoleMessage) => {
    if (msg.type() === 'log') {
      await this.attach(msg.text());
    }
  });
});

Before(async function(this: ICustomWorld) {
  await this.page!.goto(config.baseUrl)
})

After(async function(this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (config.screenshots) {
    const image = await this.page?.screenshot();
    image && (await this.attach(image, 'image/png'));
  }
  if (result?.status !== Status.PASSED) {
    await this.context?.tracing.stop({
      path: `${tracesDir}/${this.testName}-${
        this.startTime?.toISOString().split('.')[0]
      }trace.zip`
    });
  }
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function() {
  await browser.close();
});

export function createBackgroundContext(): Promise<BrowserContext> {
  return browser.newContext({
    viewport: { width: 1920, height: 1080 }
  })
}
