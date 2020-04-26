import React from 'react';
import { useSelector } from 'react-redux';
import { selectPlayerList, selectTeams } from '../../../store/selectors/lobby';
import './player-list.component.css';
import i18n from 'es2015-i18n-tag';
import { selectPlayer } from '../../../store/selectors/player';
import { switchTeam } from '../matchmaking.api';

export interface PlayerListProps {
    canChangeTeam: boolean;
    className?: string;
}

const PlayerList = ({ canChangeTeam, className }: PlayerListProps) => {
    const players = useSelector(selectPlayerList);
    const teams = useSelector(selectTeams);

    const isTeamBased = teams.length > 0;

    return (
        <div className={`card ${className}`}>
            <h2 className="subtitle">{i18n`Players`}</h2>
            {isTeamBased ? (
                <TeamList canChangeTeam={canChangeTeam} teams={teams} players={players} />
            ) : (
                <Players players={players} />
            )}
        </div>
    );
};

const TeamList = ({ teams, players, canChangeTeam }) => {
    const user = useSelector(selectPlayer);

    return (
        <div className="player-list__team-list">
            {teams.map(t => (
                <Team
                    key={t.id}
                    team={t}
                    players={players}
                    canChangeTeam={canChangeTeam && !t.players.includes(user.id)}
                />
            ))}
        </div>
    );
};

const Team = ({ team, players, canChangeTeam }) => {
    const playerList = team.players.map(playerId => players.find(p => playerId === p.id));

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
            <Players players={playerList} />
        </div>
    );
};

const Players = ({ players }) => {
    const user = useSelector(selectPlayer);

    return (
        <ul className="player-list__player-list">
            {players.map(p => {
                if (user.id === p.id) {
                    return (
                        <li
                            key={p.id}
                            className={`player-list__player-list-item`}
                        >{i18n`${p.name} (You)`}</li>
                    );
                }
                return (
                    <li key={p.id} className={`player-list__player-list-item`}>
                        {p.name}
                    </li>
                );
            })}
        </ul>
    );
};

export default PlayerList;
