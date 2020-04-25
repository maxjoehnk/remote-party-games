import React from 'react';
import TabooCard from '../taboo-card.component';
import i18n from "es2015-i18n-tag";

const TabooObserving = () => {
    return <div>
        <span>{i18n`You're observing`}</span>
        <TabooCard/>
    </div>;
};

export default TabooObserving;
