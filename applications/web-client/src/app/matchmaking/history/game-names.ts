import i18n from 'es2015-i18n-tag';

const names = {
  taboo: i18n`Taboo`,
  'stadt-land-fluss': i18n`Stadt Land Fluss`,
  'stille-post': i18n`Stille Post`, // TODO: think of a better name.
  pictionary: i18n`Pictionary`,
};

export const getGameName = (gameId: string): string => {
  return names[gameId];
};
