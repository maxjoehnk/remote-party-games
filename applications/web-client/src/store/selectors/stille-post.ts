import { createSelector } from '@reduxjs/toolkit';
import { ApplicationState } from '../index';
import { StillePostState } from '../reducers/stille-post';
import { Page } from '../../contracts/stille-post-page';

export const selectStillePostCurrentPage = createSelector(
  (state: ApplicationState) => state.stillePost,
  state => state.currentPage
);

export const selectStillePostRunning = createSelector(
  (state: ApplicationState) => state.stillePost,
  state => state.running
);

export const selectStillePostBooks = createSelector(
  (state: ApplicationState) => state.stillePost,
  state => state.books
);

export const selectStillePostOpenBook = createSelector<ApplicationState, StillePostState, OpenBook>(
  state => state.stillePost,
  state => {
    if (state.openBook == null) {
      return null;
    }
    const book = state.books.find(b => b.id === state.openBook.bookId);
    const pages = book.pages.slice(0, state.openBook.page + 1);

    return {
      id: book.id,
      pages,
      isFirstPage: state.openBook.page === 0,
      hasPagesLeft: pages.length < book.pages.length,
      currentPage: state.openBook.page,
    };
  }
);

export interface OpenBook {
  id: string;
  pages: Page[];
  isFirstPage: boolean;
  hasPagesLeft: boolean;
  currentPage: number;
}
