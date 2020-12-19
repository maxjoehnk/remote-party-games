import i18n from 'es2015-i18n-tag';

const names = {
    taboo: i18n`Taboo`,
    'stadt-land-fluss': i18n`Stadt Land Fluss`
}

export const getGameName = (gameId: string): string => {
    return names[gameId];
}
