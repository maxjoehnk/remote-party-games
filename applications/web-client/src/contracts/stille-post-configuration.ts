export enum PageConfig {
  Text = 'text',
  Image = 'draw',
  Alternate = 'alternate',
  Random = 'random',
}

export interface StillePostConfig {
  firstPage: PageConfig;
  followingPages: PageConfig;
}
