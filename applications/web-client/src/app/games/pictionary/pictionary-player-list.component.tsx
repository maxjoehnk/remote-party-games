import { mdiDraw } from '@mdi/js';
import PlayerList from '../../matchmaking/player-list/player-list.component';
import Icon from '@mdi/react';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  ScorePlayer,
  selectPictionaryCurrentRound,
  selectPictionaryPlayerList,
} from '../../../store/selectors/pictionary';
import PlayerAvatar from '../../player/player-avatar.component';

const PictionaryPlayerList = () => {
  const currentRound = useSelector(selectPictionaryCurrentRound);
  const players = useSelector(selectPictionaryPlayerList);

  return (
    <PlayerList players={players} canChangeTeam={false} className="game-pictionary__player-list">
      {(text, player: ScorePlayer, team) => {
        const isDrawingPlayer = player.id === currentRound?.drawingPlayer;

        const icon = getPlayerIcon(isDrawingPlayer);
        const className = getPlayerClassName(isDrawingPlayer);

        return (
          <span className={`game-pictionary__player ${className}`} key={player.id}>
            <PlayerAvatar className="game-pictionary__player-avatar" player={player} />
            <span className="game-pictionary__player-name">{text}</span>
            {icon && <Icon path={icon} size={1} className="game-pictionary__player-icon" />}
            <span className="game-pictionary__player-score">{player.score}</span>
          </span>
        );
      }}
    </PlayerList>
  );
};

function getPlayerIcon(isDrawingPlayer: boolean) {
  if (isDrawingPlayer) {
    return mdiDraw;
  }
  return null;
}

function getPlayerClassName(isDrawingPlayer: boolean): string {
  if (isDrawingPlayer) {
    return 'game-pictionary__player--drawing';
  }
}

export default PictionaryPlayerList;
