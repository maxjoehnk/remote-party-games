import { TabooGameConfiguration } from './taboo/config';
import { StadtLandFlussGameConfiguration } from './stadt-land-fluss/config';

export type GameConfiguration =
  | TabooGameConfiguration
  | StadtLandFlussGameConfiguration;
