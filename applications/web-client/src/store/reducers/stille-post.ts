import { createReducer } from '@reduxjs/toolkit';
import { Book, StillePostPage } from '../../contracts/stille-post-page';
import {
  stillePostAllBooksReady,
  stillePostBookClosed,
  stillePostFinishPage,
  stillePostNextPage,
  stillePostViewBook,
} from '../actions/stille-post';
import { gameStopped } from '../actions/game';

export interface StillePostState {
  running: boolean;
  currentPage: StillePostPage;
  upcomingPages: StillePostPage[];
  books?: Book[];
  openBook?: {
    bookId: string;
    page: number;
  };
}

const initialState: StillePostState = {
  running: true,
  currentPage: null,
  upcomingPages: [],
};

export const stillePostReducer = createReducer<StillePostState>(initialState, builder =>
  builder
    .addCase(stillePostNextPage, (state, action) => {
      const nextState: StillePostState = {
        ...state,
        upcomingPages: [...state.upcomingPages, action.payload],
      };
      if (nextState.currentPage == null) {
        nextState.currentPage = nextState.upcomingPages.shift();
      }
      return nextState;
    })
    .addCase(stillePostFinishPage, state => {
      const pages = [...state.upcomingPages];
      return {
        ...state,
        currentPage: pages.shift(),
        upcomingPages: pages,
      };
    })
    .addCase(stillePostAllBooksReady, (state, action) => {
      return {
        running: false,
        currentPage: null,
        upcomingPages: [],
        books: action.payload,
      };
    })
    .addCase(stillePostViewBook, (state, action) => ({
      ...state,
      openBook: action.payload,
    }))
    .addCase(stillePostBookClosed, state => ({
      ...state,
      openBook: null,
    }))
    .addCase(gameStopped, () => initialState)
);
