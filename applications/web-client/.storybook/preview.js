import '../src/styles/styles.scss'
import './story.css'
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [Story => <MemoryRouter><Story/></MemoryRouter>];
