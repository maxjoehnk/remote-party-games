import React from 'react';
import TabooCard from '../taboo-card.component';
import i18n from 'es2015-i18n-tag';
import { useSelector } from 'react-redux';
import { selectCurrentTabooCard } from '../../../../store/selectors/taboo';

const TabooObserving = () => {
  const currentCard = useSelector(selectCurrentTabooCard);

  return (
    <div>
      <span>{i18n('taboo')`You're observing`}</span>
      <TabooCard card={currentCard} />
    </div>
  );
};

export default TabooObserving;
