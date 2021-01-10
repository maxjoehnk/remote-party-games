import React from 'react';
import { useSelector } from 'react-redux';
import {
  ResultColumn,
  selectStadtLandFlussResults,
} from '../../../store/selectors/stadt-land-fluss';
import i18n from 'es2015-i18n-tag';
import Button from '../../ui-elements/button/button.component';
import { approveWord, denyWord, upvoteWord } from './stadt-land-fluss-api';
import { selectPlayer } from '../../../store/selectors/player';
import PlayerAvatar from '../../player/player-avatar.component';
import NextRoundButton from './actions/next-round-button.component';

const StadtLandFlussResults = () => {
  const columns = useSelector(selectStadtLandFlussResults);

  return (
    <div className="game-stadt-land-fluss__results">
      {columns.map((column, i) => (
        <StadtLandFlussResultColumn column={column} index={i} key={i} />
      ))}
      <NextRoundButton />
    </div>
  );
};

const StadtLandFlussResultColumn = ({ column, index }: { column: ResultColumn; index: number }) => {
  return (
    <div className="card game-stadt-land-fluss-result-column">
      <div className="game-stadt-land-fluss-column__header">{column.name}</div>
      {column.answers.map(a => (
        <StadtLandFlussAnswer column={index} key={a.player.id} answer={a} />
      ))}
    </div>
  );
};

const StadtLandFlussAnswer = ({ answer, column }) => {
  const player = useSelector(selectPlayer);
  const actionsEnabled = player.id !== answer.player.id && !!answer.answer;

  return (
    <div className="game-stadt-land-fluss-result-answer">
      <PlayerAvatar player={answer.player} />
      <b className="game-stadt-land-fluss-result-answer__player">{answer.player.name}:</b>
      <span
        className={`game-stadt-land-fluss-result-answer__answer ${
          !answer.answer && 'game-stadt-land-fluss-result-answer__answer--empty'
        } ${answer.denied && 'game-stadt-land-fluss-result-answer__answer--denied'}`}
      >
        {answer.answer || i18n('stadt-land-fluss')`<empty>`}
      </span>
      {actionsEnabled && (
        <div className="game-stadt-land-fluss-result-answer__actions">
          <Button onClick={() => upvoteWord(answer.player.id, column)}>{i18n(
            'stadt-land-fluss'
          )`Upvote`}</Button>
          {answer.denied && (
            <Button
              className="button--primary"
              onClick={() => approveWord(answer.player.id, column)}
            >{i18n('stadt-land-fluss')`Approve`}</Button>
          )}
          {!answer.denied && (
            <Button
              className="button--error"
              onClick={() => denyWord(answer.player.id, column)}
            >{i18n('stadt-land-fluss')`Deny`}</Button>
          )}
        </div>
      )}
      <AddedPoints score={answer.score} upvotes={answer.upvotes} />
    </div>
  );
};

const POINTS_PER_UPVOTE = 5;

const AddedPoints = ({ score, upvotes }) => {
  const pointsFromUpvotes = upvotes * POINTS_PER_UPVOTE;
  const rawScore = score - pointsFromUpvotes;
  const label =
    upvotes > 0
      ? i18n('stadt-land-fluss')`${rawScore} (+${pointsFromUpvotes}) Points`
      : i18n`${score} Points`;

  return (
    <span className={`game-stadt-land-fluss-result-answer__score ${getScoreClass(rawScore)}`}>
      {label}
    </span>
  );
};

function getScoreClass(score) {
  switch (score) {
    case 20:
      return 'game-stadt-land-fluss-result-answer__score--single';
    case 10:
      return 'game-stadt-land-fluss-result-answer__score--unique';
    case 5:
      return 'game-stadt-land-fluss-result-answer__score--common';
    default:
      return '';
  }
}

export default StadtLandFlussResults;
