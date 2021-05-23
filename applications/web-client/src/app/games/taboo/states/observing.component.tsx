import React from 'react';
import TabooCard from '../taboo-card.component';
import { useSelector } from 'react-redux';
import { selectCurrentTabooCard } from '../../../../store/selectors/taboo';

const TabooObserving = () => {
  const currentCard = useSelector(selectCurrentTabooCard);

  return (
    <div>
      <TabooCard card={currentCard} />
    </div>
  );
};

export default TabooObserving;
