import { Provider } from 'react-redux';
import React from 'react';

export const getStore = (state): any => ({
  getState: () => state,
  subscribe: () => {
  },
  dispatch: () => {
  }
});

export const storeDecorator = (state) => Story => <Provider
  store={getStore(state)}><Story /></Provider>;
