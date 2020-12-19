import { useSelector } from 'react-redux';
import { selectGameHistory } from '../../../store/selectors/lobby';
import i18n from 'es2015-i18n-tag';
import React from 'react';
import { GameHistoryModel } from '../../../contracts/history.model';
import Icon from '@mdi/react';
import { mdiChevronRight } from '@mdi/js';
import './game-history-list.component.css';
import { Link } from 'react-router-dom';
import { getResult } from './result-helpers';
import { getGameName } from './game-names';

const GameHistoryList = ({ className }) => {
    const history = useSelector(selectGameHistory);

    return (
        <div className={`card ${className}`}>
            <h2 className="subtitle">{i18n`Game History`}</h2>
            <div className="game-history-list">
                {history.map((entry, i) => (
                    <HistoryEntry key={i} entry={entry} index={i} />
                ))}
            </div>
        </div>
    );
};

const HistoryEntry = ({ entry, index }: { entry: GameHistoryModel; index: number }) => {
  const result = getResult(entry);

  return (
    <Link to={({ pathname }) => `${pathname}/history/${index}`} className="game-history-entry">
      <h3 className="game-history-entry__game">{getGameName(entry.game)}</h3>
      <span className="game-history-entry__result">{result}</span>
      <Icon size="24px" className="game-history-entry__chevron" path={mdiChevronRight} />
    </Link>
  );
};

export default GameHistoryList;
