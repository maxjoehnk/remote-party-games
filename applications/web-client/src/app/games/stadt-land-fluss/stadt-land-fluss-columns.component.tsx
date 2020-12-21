import React, { useEffect, useState } from 'react';
import { submitWord } from './stadt-land-fluss-api';
import Icon from '@mdi/react';
import { mdiCheckCircleOutline, mdiCloseCircleOutline, mdiHelpCircleOutline } from '@mdi/js';
import i18n from 'es2015-i18n-tag';
import { useSelector } from 'react-redux';
import { selectStadtLandFlussColumns } from '../../../store/selectors/stadt-land-fluss';
import StopRoundButton from './actions/stop-round-button.component';

const SUBMIT_WORD_DEBOUNCE = 500;

const StadtLandFlussColumns = ({ letter }: { letter: string }) => {
  const columns = useSelector(selectStadtLandFlussColumns);

  return (
    <div className="game-stadt-land-fluss__columns">
      {columns.map((column, i) => (
        <StadtLandFlussColumn
          letter={letter}
          index={i}
          column={column}
          key={column}
          isFirst={i === 0}
        />
      ))}
      <StopRoundButton />
    </div>
  );
};

const StadtLandFlussColumn = ({
  column,
  index,
  letter,
  isFirst,
}: {
  column: string;
  index: number;
  letter: string;
  isFirst: boolean;
}) => {
  const inputId = `column-${column}-input`;
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(null);
  useEffect(() => {
    if (timer != null) {
      clearTimeout(timer);
    }
    setTimer(setTimeout(() => submitWord(index, value), SUBMIT_WORD_DEBOUNCE));
  }, [value]);

  const valid = isValid(value, letter);
  const empty = value === '' || value === letter;
  const invalid = !valid && !empty;

  return (
    <div
      className={`card game-stadt-land-fluss-column ${
        valid && 'game-stadt-land-fluss-column--valid'
      }`}
    >
      <div className="game-stadt-land-fluss-column__header">
        <label htmlFor={inputId}>{column}</label>
        {valid && (
          <Icon
            size="24px"
            path={mdiCheckCircleOutline}
            className="game-stadt-land-fluss-column__icon--valid"
          />
        )}
        {empty && (
          <Icon
            size="24px"
            path={mdiHelpCircleOutline}
            className="game-stadt-land-fluss-column__icon--empty"
          />
        )}
        {invalid && (
          <Icon
            size="24px"
            path={mdiCloseCircleOutline}
            className="game-stadt-land-fluss-column__icon--invalid"
          />
        )}
      </div>
      <input
        className="input"
        id={inputId}
        autoFocus={isFirst}
        placeholder={i18n('stadt-land-fluss')`${column} starting with ${letter}`}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
};

const isValid = (value: string, letter: string): boolean => {
  return value.length > 1 && value[0] === letter;
};

export default StadtLandFlussColumns;
