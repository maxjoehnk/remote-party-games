import { PictionaryGameState, PlayerRanking } from './contracts';
import { PlayerModel } from '@party-games/web-client/src/contracts/player.model';
import { POINTS_PER_ANSWER, POINTS_PER_FOLLOWING_ANSWERS } from './config';

export function calculateRanking(
  state: PictionaryGameState,
  players: PlayerModel[]
): PlayerRanking[] {
  const answerCount = state.answers.length;
  const drawer: PlayerRanking = {
    player: state.currentPlayer,
    points: answerCount * POINTS_PER_ANSWER,
  };
  const guessedPlayers: PlayerRanking[] = [];
  for (let i = 0; i < state.answers.length; i++) {
    const followingAnswers = answerCount - i;
    const points = followingAnswers * POINTS_PER_FOLLOWING_ANSWERS;
    guessedPlayers.push({
      points,
      player: state.answers[i],
    });
  }
  const failedPlayers = players
    .filter(p => p.id !== drawer.player && !state.answers.includes(p.id))
    .map(player => ({
      player: player.id,
      points: 0,
    }));

  return [drawer, ...guessedPlayers, ...failedPlayers];
}
