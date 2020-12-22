import { GameHistoryModel } from '../../../contracts/history.model';
import i18n from 'es2015-i18n-tag';
import { PlayerModel } from '../../../contracts/player.model';
import { TeamModel } from '../../../contracts/team.model';

export function getResult(entry: GameHistoryModel): string {
  if (entry.score == null) {
    return;
  }
  const winner = getWinner(entry);
  const result = winner == null ? i18n`Draw` : i18n`Winner: ${winner.name}`;

  return result;
}

function getWinner(entry: GameHistoryModel): PlayerModel | TeamModel {
  if (entry.score.type === 'team-score') {
    return entry.score.teams.find(t => t.id === entry.score.winner);
  } else if (entry.score.type === 'player-score') {
    return entry.players.find(p => p.id === entry.score.winner);
  }
}
