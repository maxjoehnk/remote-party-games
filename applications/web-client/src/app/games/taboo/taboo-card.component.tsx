import { useSelector } from 'react-redux';
import { selectCurrentTabooCard } from '../../../store/selectors/taboo';
import React from 'react';
import './taboo-card.component.css';

const TabooCard = () => {
    const currentCard = useSelector(selectCurrentTabooCard);

    return (
        <div className="taboo-card">
            <h3 className="taboo-card__term">{currentCard.term}</h3>
            <div className="taboo-card__taboo-words">
                {currentCard.taboo.map(t => (
                    <span className="taboo-card__taboo-word" key={t}>
                        {t}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TabooCard;
