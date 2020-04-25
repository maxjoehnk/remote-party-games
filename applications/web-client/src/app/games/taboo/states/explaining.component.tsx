import React from 'react';
import TabooCard from '../taboo-card.component';
import i18n from 'es2015-i18n-tag';
import Button from '../../../ui-elements/button/button.component';
import { rightGuess, skipCard } from '../taboo-api';

const TabooExplaining = () => {
    return <div className="game-taboo__explaining">
        <span>{i18n`You're explaining`}</span>
        <TabooCard/>
        <div className="game-taboo__actions">
            <Button primary onClick={() => rightGuess()}>{i18n`Guessed`}</Button>
            <Button onClick={() => skipCard()}>{i18n`Skip`}</Button>
        </div>
    </div>;
};

export default TabooExplaining;
