import React from 'react';
import { useSelector } from 'react-redux';
import { selectStadtLandFlussPlayerScores } from '../../../store/selectors/stadt-land-fluss';
import PlayerList, { PlayerItem } from '../../matchmaking/player-list/player-list.component';
import { selectPlayerList } from '../../../store/selectors/lobby';

const StadtLandFlussPlayerList = () => {
  const players = useSelector(selectPlayerList);
  const scores = useSelector(selectStadtLandFlussPlayerScores);

  const sortedPlayers = [...players].sort((lhs, rhs) => scores[rhs.id] - scores[lhs.id]);

  return (
    <PlayerList canChangeTeam={false} className="game-stadt-land-fluss__player-list" players={sortedPlayers}>
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
