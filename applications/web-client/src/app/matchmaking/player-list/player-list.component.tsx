import React from 'react';
import { useSelector } from 'react-redux';
import { selectPlayerList, selectTeams } from '../../../store/selectors/lobby';
import './player-list.component.css';
import i18n from 'es2015-i18n-tag';
import { selectPlayer } from '../../../store/selectors/player';
import { switchTeam } from '../matchmaking.api';
import { PlayerModel } from '../../../contracts/player.model';
import { TeamModel } from '../../../contracts/team.model';
import PlayerAvatar from '../../player/player-avatar.component';

export interface PlayerListProps<T extends PlayerModel = PlayerModel> {
  canChangeTeam: boolean;
  players?: T[];
  className?: string;
  children?: (text: string, player: T, team?: TeamModel) => any;
}

const PlayerList = ({ canChangeTeam, className, ...props }: PlayerListProps) => {
  const players = props.players ?? useSelector(selectPlayerList);
  const teams = useSelector(selectTeams);

  const isTeamBased = teams.length > 0;

  return (
    <div className={`card ${className}`}>
      <h2 className="subtitle">{i18n`Players`}</h2>
      {isTeamBased ? (
        <TeamList canChangeTeam={canChangeTeam} teams={teams} players={players} {...props} />
      ) : (
        <Players players={players} {...props} />
      )}
    </div>
  );
};

const TeamList = ({ teams, players, canChangeTeam, ...props }) => {
  const user = useSelector(selectPlayer);

  return (
    <div className="player-list__team-list">
      {teams.map(t => (
        <Team
          key={t.id}
          team={t}
          players={players}
          canChangeTeam={canChangeTeam && !t.players.includes(user.id)}
          {...props}
        />
      ))}
    </div>
  );
};

interface TeamProps {
  team: TeamModel;
  players: PlayerModel[];
  canChangeTeam: boolean;
  children?: (text: string, player: PlayerModel, team: TeamModel) => any;
}

const Team = ({ team, players, canChangeTeam, children }: TeamProps) => {
  const playerList = team.players.map(playerId => players.find(p => playerId === p.id));
  const enhancedChildren = (text, player) => children(text, player, team);

  return (
    <div>
      <h3 className="player-list__team-header">
        <span className="player-list__team-name">{team.name}</span>
        {canChangeTeam && (
          <button
            className="player-list__join-team-btn"
            onClick={() => switchTeam(team.id)}
          >{i18n`Join Team`}</button>
        )}
      </h3>
      <Players players={playerList} children={children && enhancedChildren} />
    </div>
  );
};

interface PlayersProps {
  players: PlayerModel[];
  children?: (text: string, player: PlayerModel) => any;
  className?: string;
}

export const Players = ({ players, children, className }: PlayersProps) => {
  const user = useSelector(selectPlayer);

  return (
    <ul className={`player-list__player-list ${className}`}>
      {players.map(p => {
        const text = user.id === p.id ? i18n`${p.name} (You)` : p.name;

        if (children) {
          return children(text, p);
        }

        return (
          <PlayerItem key={p.id} player={p}>
            {text}
          </PlayerItem>
        );
      })}
    </ul>
  );
};

export const PlayerItem = ({
  player,
  children,
  className,
}: {
  player: PlayerModel;
  children?: any;
  className?: string;
}) => {
  const user = useSelector(selectPlayer);

  return (
    <li
      className={`player-list__player-list-item ${
        user.id === player.id && 'player-list__player-list-item--self'
      } ${className}`}
    >
      <PlayerAvatar className="player-list__player-avatar" player={player} />
      {children}
    </li>
  );
};

export default PlayerList;
