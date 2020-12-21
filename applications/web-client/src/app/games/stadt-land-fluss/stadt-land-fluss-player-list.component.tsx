import React from 'react';
import { useSelector } from 'react-redux';
import { selectStadtLandFlussPlayerScores } from '../../../store/selectors/stadt-land-fluss';
import PlayerList, { PlayerItem } from '../../matchmaking/player-list/player-list.component';

const StadtLandFlussPlayerList = () => {
  const scores = useSelector(selectStadtLandFlussPlayerScores);

  return (
    <PlayerList canChangeTeam={false} className="game-stadt-land-fluss__player-list">
      {(text, player) => {
        const score = scores[player.id];

        return (
          <PlayerItem player={player}>
            <span className="player-list__player-name">{text}</span>
            <span>{score}</span>
          </PlayerItem>
        );
      }}
    </PlayerList>
  );
};

export default StadtLandFlussPlayerList;
