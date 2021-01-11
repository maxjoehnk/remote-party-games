import { useSelector } from 'react-redux';
import { selectPictionaryScores } from '../../../../store/selectors/pictionary';
import React from 'react';
import PlayerAvatar from '../../../player/player-avatar.component';
import './scores-view.css';
import i18n from 'es2015-i18n-tag';
import Button from '../../../ui-elements/button/button.component';
import { nextRound } from '../pictionary-api';

export const PictionaryScoresView = () => {
  const rankings = useSelector(selectPictionaryScores);
  return (
    <div className="card pictionary-scores">
      <h2>{i18n('pictionary')`Scores`}</h2>
      {rankings.map(r => (
        <PictionaryScoreEntry ranking={r} key={r.player.id} />
      ))}
      <Button onClick={() => nextRound()}>{i18n('pictionary')`Next Round`}</Button>
    </div>
  );
};

const PictionaryScoreEntry = ({ ranking }) => {
  return (
    <div className="pictionary-scores__entry">
      <PlayerAvatar player={ranking.player} />
      <span className="pictionary-scores__player-name">{ranking.player.name}</span>
      <span className="pictionary-scores__points">{ranking.points}</span>
    </div>
  );
};
