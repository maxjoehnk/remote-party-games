import { useSelector } from 'react-redux';
import { selectGameHistory } from '../../../store/selectors/lobby';
import { Redirect, useParams } from 'react-router-dom';
import React from 'react';
import { GameHistoryModel } from '../../../contracts/history.model';
import i18n from 'es2015-i18n-tag';
import { TeamModel } from '../../../contracts/team.model';
import { PlayerModel } from '../../../contracts/player.model';
import { Players } from '../player-list/player-list.component';
import './game-history.component.css';

interface GameHistoryRouteParams {
    game: string;
    code: string;
}

const GameHistory = () => {
    const { game: gameIndex } = useParams<GameHistoryRouteParams>();
    const history = useSelector(selectGameHistory);
    const game = history[parseInt(gameIndex, 10)];
    if (game == null) {
        return <Redirect to="/" />;
    }

    return (
        <div className="game-history card">
            <h2>{capitalize(game.game)}</h2>
            <h3>
                <GameResult game={game} />
            </h3>
            <div className="game-history__team-list">
                {game.score.teams.map(team => (
                    <TeamScore
                        team={team}
                        score={game.score.scores[team.id]}
                        players={game.players}
                    />
                ))}
            </div>
        </div>
    );
};

const GameResult = ({ game }: { game: GameHistoryModel }) => {
    const winner = game.score.teams.find(t => t.id === game.score.winner);
    const result = winner == null ? i18n`Draw` : i18n`Winner: ${winner.name}`;

    return result;
};

const TeamScore = ({
    team,
    score,
    players
}: {
    team: TeamModel;
    score: number;
    players: PlayerModel[];
}) => {
    const playerList = team.players.map(id => players.find(p => p.id === id));
    return (
        <div className="game-history__team-score">
            <h4>
                {team.name}
                <span className="game-history__score"> - {i18n`${score} Point(s)`}</span>
            </h4>
            <div className="game-history__player-list">
                <Players players={playerList} />
            </div>
        </div>
    );
};

function capitalize(name: string) {
    const [first, ...rest] = name;

    return first.toUpperCase() + rest.join('');
}

export default GameHistory;
