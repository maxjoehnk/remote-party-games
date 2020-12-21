import { useSelector } from 'react-redux';
import { selectGameHistory } from '../../../store/selectors/lobby';
import { Redirect, useParams } from 'react-router-dom';
import React from 'react';
import i18n from 'es2015-i18n-tag';
import { TeamModel } from '../../../contracts/team.model';
import { PlayerModel } from '../../../contracts/player.model';
import { PlayerItem, Players } from '../player-list/player-list.component';
import './game-history.component.css';
import { getResult } from './result-helpers';
import { getGameName } from './game-names';

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
      <h2>{getGameName(game.game)}</h2>
      <h3>{getResult(game)}</h3>
      {game.score.type === 'team-score' && (
        <div className="game-history__team-list">
          {game.score.teams.map(team => (
            <TeamScore team={team} score={game.score.scores[team.id]} players={game.players} />
          ))}
        </div>
      )}
      {game.score.type === 'player-score' && (
        <Players players={game.players}>
          {(text, player) => {
            const score = game.score.scores[player.id];

            return (
              <PlayerItem player={player}>
                <span className="player-list__player-name">{text}</span>
                <span className="game-history__score">{i18n`${score} Point(s)`}</span>
              </PlayerItem>
            );
          }}
        </Players>
      )}
    </div>
  );
};

const TeamScore = ({
  team,
  score,
  players,
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
      <Players players={playerList} />
    </div>
  );
};

export default GameHistory;
