import { createAction } from '@reduxjs/toolkit';
import { StadtLandFlussGameState } from '../../contracts/stadt-land-fluss-configuration';

export const stadtLandFlussGameUpdate = createAction<StadtLandFlussGameState>(
  'stadt-land-fluss/game-update'
);
