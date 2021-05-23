import React from 'react';
import TabooCard from '../taboo-card.component';
import i18n from 'es2015-i18n-tag';
import Button from '../../../ui-elements/button/button.component';
import { rightGuess, skipCard } from '../taboo-api';
import { useSelector } from 'react-redux';
import { selectCurrentTabooCard } from '../../../../store/selectors/taboo';

const TabooExplaining = () => {
  const currentCard = useSelector(selectCurrentTabooCard);

  return (
    <div className="game-taboo__explaining">
      <TabooCard card={currentCard} />
      <div className="game-taboo__actions">
        <Button primary onClick={() => rightGuess()}>{i18n('taboo')`Guessed`}</Button>
        <Button card onClick={() => skipCard()}>{i18n('taboo')`Skip`}</Button>
      </div>
    </div>
  );
};

export default TabooExplaining;
