import React from 'react';
import PlayerList from '../../matchmaking/player-list/player-list.component';

const StillePostPlayerList = () => {
  return (
    <div className="game-stille-post__player-list">
      <PlayerList canChangeTeam={false} />
    </div>
  );
};

export default StillePostPlayerList;
