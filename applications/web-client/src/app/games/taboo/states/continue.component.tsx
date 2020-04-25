import React from 'react';
import i18n from "es2015-i18n-tag";
import Button from '../../../ui-elements/button/button.component';
import { continueGame } from '../taboo-api';
import TabooCard from '../taboo-card.component';

const TabooContinue = () => {
    return <div>
        <span>{i18n`You're next`}</span>
        <TabooCard/>
        <div className="game-taboo__actions">
            <Button primary onClick={() => continueGame()}>{i18n`Start`}</Button>
        </div>
    </div>;
};

export default TabooContinue;
