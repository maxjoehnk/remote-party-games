import { SocketBroadcaster, SocketMessage } from '../../sockets/socket-broadcaster';
import { GamePhase, PictionaryGameState, PictionaryView, RoundState } from './contracts';
import { PictionaryEventTypes } from './messages';
import { ALWAYS_VISIBLE_LETTERS } from './config';
import { Player } from '../../contracts/player';

export class PictionaryRoundStateMessenger {
  constructor(private broadcaster: SocketBroadcaster) {}

  public async broadcastUpdate(state: PictionaryGameState, players: Player[]) {
    this.sendRunningUpdate(state, players);
    this.sendSelectionUpdate(state, players);
    this.sendScoresUpdate(state, players);
  }

  private sendRunningUpdate(state: PictionaryGameState, players: Player[]) {
    if (state.phase === GamePhase.Running) {
      this.sendDrawingUpdate(state, players);
      this.sendGuessingUpdate(state, players);
    }
  }

  private sendDrawingUpdate(state: PictionaryGameState, players: Player[]) {
    {
      const roundState = this.getDrawingState(state);
      this.broadcast(
        {
          type: PictionaryEventTypes.Update,
          state: roundState,
        },
        [state.currentPlayer]
      );
    }
  }

  private sendGuessingUpdate(state: PictionaryGameState, players: Player[]) {
    {
      const roundState = this.getGuessingState(state);
      this.broadcast(
        {
          type: PictionaryEventTypes.Update,
          state: roundState,
        },
        players.map(p => p.id).filter(playerId => playerId !== state.currentPlayer)
      );
    }
  }

  private sendSelectionUpdate(state: PictionaryGameState, players: Player[]) {
    if (state.phase === GamePhase.SelectingWord) {
      this.sendWordSelectionUpdate(state);
      this.sendIdleUpdate(state, players);
    }
  }

  private sendWordSelectionUpdate(state: PictionaryGameState) {
    const roundState = this.getWordSelectionState(state);
    this.broadcast(
      {
        type: PictionaryEventTypes.Update,
        state: roundState,
      },
      [state.currentPlayer]
    );
  }

  private sendIdleUpdate(state: PictionaryGameState, players: Player[]) {
    const roundState = this.getIdleState(state);
    this.broadcast(
      {
        type: PictionaryEventTypes.Update,
        state: roundState,
      },
      players.map(p => p.id).filter(playerId => playerId !== state.currentPlayer)
    );
  }

  private sendScoresUpdate(state: PictionaryGameState, players: Player[]) {
    if (state.phase === GamePhase.Scores) {
      const roundState = this.getScoresState(state);
      this.broadcast(
        {
          type: PictionaryEventTypes.Update,
          state: roundState,
        },
        players.map(p => p.id)
      );
    }
  }

  private getIdleState(state: PictionaryGameState): RoundState {
    return {
      drawingPlayer: state.currentPlayer,
      view: PictionaryView.Idle,
    };
  }

  private getScoresState(state: PictionaryGameState): RoundState {
    return {
      drawingPlayer: state.currentPlayer,
      view: PictionaryView.Scores,
      rankings: state.rankings,
      word: state.currentWord,
    };
  }

  private getDrawingState(state: PictionaryGameState): RoundState {
    return {
      drawingPlayer: state.currentPlayer,
      word: state.currentWord,
      timeLeft: state.timeLeft,
      view: PictionaryView.Drawing,
    };
  }

  private getGuessingState(state: PictionaryGameState): RoundState {
    return {
      drawingPlayer: state.currentPlayer,
      letters: state.currentWord.split('').map((letter, i) => {
        if (state.visibleLetters.includes(i)) {
          return letter;
        }
        return ALWAYS_VISIBLE_LETTERS.includes(letter) ? letter : '_';
      }),
      timeLeft: state.timeLeft,
      view: PictionaryView.Guessing,
    };
  }

  private getWordSelectionState(state: PictionaryGameState): RoundState {
    return {
      drawingPlayer: state.currentPlayer,
      wordsToChooseFrom: state.availableWords,
      view: PictionaryView.WordSelection,
    };
  }

  private broadcast(message: SocketMessage, players: string[]) {
    this.broadcaster.broadcast(message, (ws, playerId) => players.includes(playerId));
  }
}
