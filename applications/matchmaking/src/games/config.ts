import { TabooGameConfiguration } from './taboo/config';
import { StadtLandFlussGameConfiguration } from './stadt-land-fluss/config';
import { StillePostGameConfiguration } from './stille-post/config';

export type GameConfiguration =
  | TabooGameConfiguration
  | StadtLandFlussGameConfiguration
  | StillePostGameConfiguration;
