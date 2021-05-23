import { useSelector } from 'react-redux';
import { selectTabooPastCards } from '../../../../store/selectors/taboo';
import TabooCard from '../taboo-card.component';
import React from 'react';
import { PastCardAnswer, PastCardState } from '../../../../contracts/taboo-game-configuration';
import Button from '../../../ui-elements/button/button.component';
import { guessedPastCard, skippedPastCard } from '../taboo-api';
import i18n from 'es2015-i18n-tag';

const TabooWaiting = () => {
  const cards = useSelector(selectTabooPastCards);

  return (
    <div className="game-taboo__card-list">
      {cards.map(card => (
        <TabooPastCard key={card.card.term} card={card} />
      ))}
    </div>
  );
};

const TabooPastCard = ({ card }: { card: PastCardState }) => {
  return (
    <div>
      <TabooCard key={card.card.term} card={card.card} answer={card.answer} />
      <div className="game-taboo__actions">
        {card.answer === PastCardAnswer.Guessed && (
          <Button card onClick={() => skippedPastCard(card.card.term)}>{i18n('taboo')`Skipped`}</Button>
        )}
        {card.answer === PastCardAnswer.Skipped && (
          <Button card onClick={() => guessedPastCard(card.card.term)}>{i18n('taboo')`Guessed`}</Button>
        )}
        {card.answer === PastCardAnswer.TimedOut && (
          <Button card onClick={() => guessedPastCard(card.card.term)}>{i18n('taboo')`Guessed`}</Button>
        )}
      </div>
    </div>
  );
};

export default TabooWaiting;
