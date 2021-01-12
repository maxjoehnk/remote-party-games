import { createAction } from '@reduxjs/toolkit';
import { ChatMessage, PictionaryRoundState, PlayerRanking } from '../reducers/pictionary';

export const pictionaryGameUpdate = createAction<PictionaryRoundState>('pictionary/game-update');
export const pictionaryChat = createAction<ChatMessage>('pictionary/chat');
export const pictionaryRightGuess = createAction('pictionary/right-guess');
export const pictionaryScores = createAction<PlayerRanking[]>('pictionary/scores');
