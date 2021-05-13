import React from 'react';
import './taboo-card.component.css';
import { TabooCardModel } from '../../../contracts/taboo-card';
import { PastCardAnswer } from '../../../contracts/taboo-game-configuration';
import i18n from 'es2015-i18n-tag';

export interface TabooCardProps {
  card: TabooCardModel;
  answer?: PastCardAnswer;
}

const TabooCard = ({ card, answer }: TabooCardProps) => {
  const classes = [
    'taboo-card',
    answer === PastCardAnswer.Skipped && 'taboo-card--skipped',
    answer === PastCardAnswer.Guessed && 'taboo-card--guessed',
    answer === PastCardAnswer.TimedOut && 'taboo-card--timed-out',
  ]
    .filter(c => !!c)
    .join(' ');

  return (
    <div className={classes}>
      <h3 className="taboo-card__term">{card.term}</h3>
      <div className="taboo-card__taboo-words">
        {card.taboo.map(t => (
          <span className="taboo-card__taboo-word" key={t}>
            {t}
          </span>
        ))}
      </div>
      {answer != null && <CardAnswerStamp answer={answer} />}
    </div>
  );
};

const CardAnswerStamp = ({ answer }: { answer: PastCardAnswer }) => {
  return (
    <div className="taboo-card__card-answer">
      {answer === PastCardAnswer.Guessed && i18n('taboo')`Guessed`}
      {answer === PastCardAnswer.Skipped && i18n('taboo')`Skipped`}
      {answer === PastCardAnswer.TimedOut && i18n('taboo')`Timed Out`}
    </div>
  );
};

export default TabooCard;
