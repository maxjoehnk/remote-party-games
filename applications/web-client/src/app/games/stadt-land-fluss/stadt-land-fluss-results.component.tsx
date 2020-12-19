import React from 'react';
import { useSelector } from 'react-redux';
import { ResultColumn, selectStadtLandFlussResults } from '../../../store/selectors/stadt-land-fluss';
import i18n from 'es2015-i18n-tag';
import Button from '../../ui-elements/button/button.component';
import { denyWord, upvoteWord } from './stadt-land-fluss-api';
import { selectPlayer } from '../../../store/selectors/player';

const StadtLandFlussResults = () => {
  const columns = useSelector(selectStadtLandFlussResults);

  return (
    <div className="game-stadt-land-fluss__results">
        {columns.map((column, i) => <StadtLandFlussResultColumn column={column} index={i} key={i} />)}
    </div>
  );
};

const StadtLandFlussResultColumn = ({ column, index }: { column: ResultColumn; index: number; }) => {
  return (<div className="card game-stadt-land-fluss-result-column">
    <div className="game-stadt-land-fluss-column__header">
      {column.name}
    </div>
    {column.answers.map(a => <StadtLandFlussAnswer column={index} key={a.player.id} answer={a}/>)}
  </div>
  )
};

const StadtLandFlussAnswer = ({ answer, column }) => {
    const player = useSelector(selectPlayer);
    const actionsEnabled = player.id !== answer.player.id && !!answer.answer;

    return (
        <div className="game-stadt-land-fluss-result-answer">
            <img
                className="player-list__player-avatar"
                src={`${window.location.origin}/api/image/${answer.player.id}`}
            />
            <b className="game-stadt-land-fluss-result-answer__player">{answer.player.name}:</b>
            <span
                className={`game-stadt-land-fluss-result-answer__answer ${!answer.answer && 'game-stadt-land-fluss-result-answer__answer-empty'}`}>{answer.answer || i18n('stadt-land-fluss')`<empty>`}</span>
            {actionsEnabled && <div className="game-stadt-land-fluss-result-answer__actions">
                <Button onClick={() => upvoteWord(answer.player.id, column)}>{i18n('stadt-land-fluss')`Upvote`}</Button>
                <Button className="button--error" onClick={() => denyWord(answer.player.id, column)}>{i18n('stadt-land-fluss')`Deny`}</Button>
            </div>}
            <AddedPoints score={answer.score} upvotes={answer.upvotes} />
        </div>
    );
};

const POINTS_PER_UPVOTE = 5;

const AddedPoints = ({ score, upvotes }) => {
    const pointsFromUpvotes = upvotes * POINTS_PER_UPVOTE;
    const rawScore = score - pointsFromUpvotes;
    const label = upvotes > 0 ? i18n('stadt-land-fluss')`${rawScore} (+${pointsFromUpvotes}) Points` : i18n`${score} Points`;

    return <span className={`game-stadt-land-fluss-result-answer__score ${getScoreClass(rawScore)}`}>{label}</span>;
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
