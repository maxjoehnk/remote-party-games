export const TABOO = 'taboo';
export const STADT_LAND_FLUSS = 'stadt-land-fluss';
export const STILLE_POST = 'stille-post';
export const PICTIONARY = 'pictionary';

export type GameTypes =
  | typeof TABOO
  | typeof STADT_LAND_FLUSS
  | typeof STILLE_POST
  | typeof PICTIONARY;
