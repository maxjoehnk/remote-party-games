export enum PageType {
  Text = 'text',
  Draw = 'draw',
}

export enum PageConfig {
  Random = 'random',
  Alternate = 'alternate',
}

export interface StillePostGameConfiguration {
  firstPage: PageType | PageConfig.Random;
  followingPages: PageType | PageConfig;
}

export const defaultStillePostConfig: StillePostGameConfiguration = {
  firstPage: PageType.Text,
  followingPages: PageConfig.Alternate,
};
