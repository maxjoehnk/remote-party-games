import React from 'react';
import i18n from 'es2015-i18n-tag';
import Button from '../../../ui-elements/button/button.component';
import { continueGame } from '../taboo-api';
import TabooCard from '../taboo-card.component';
import { useSelector } from 'react-redux';
import { selectCurrentTabooCard } from '../../../../store/selectors/taboo';

const TabooContinue = () => {
  const currentCard = useSelector(selectCurrentTabooCard);

  return (
    <div>
      <span className="game-taboo__state-hint">{}</span>
      <TabooCard card={currentCard} />
      <div className="game-taboo__actions">
        <Button primary onClick={() => continueGame()}>{i18n('taboo')`Start`}</Button>
      </div>
    </div>
  );
};

export default TabooContinue;
