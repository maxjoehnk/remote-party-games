import { PlayerModel } from '../../contracts/player.model';
import React, { useEffect, useState } from 'react';
import { onMessage } from '../../socket';
import './player-avatar.component.css';

const PlayerAvatar = ({
  player,
  className,
  ...args
}: {
  player: PlayerModel;
  className?: string;
}) => {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const subscription = onMessage('user/image-changed', msg => {
      if (msg.playerId === player.id) {
        setCounter(c => c + 1);
      }
    });

    return subscription.unsubscribe;
  }, []);

  return (
    <img
      {...args}
      className={`player-avatar ${className}`}
      src={`${window.location.origin}/api/image/${player.id}?version=${counter}`}
      alt={`${player.name} Avatar`}
    />
  );
};

export default PlayerAvatar;
