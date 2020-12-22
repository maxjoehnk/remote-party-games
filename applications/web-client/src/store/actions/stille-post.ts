import { createAction } from '@reduxjs/toolkit';
import { Book, StillePostPage } from '../../contracts/stille-post-page';

export const stillePostFinishPage = createAction<string>('stille-post/finish-page');
export const stillePostNextPage = createAction<StillePostPage>('stille-post/next-page');
export const stillePostAllBooksReady = createAction<Book[]>('stille-post/books-ready');
export const stillePostViewBook = createAction<{ bookId: string; page: number }>(
  'stille-post/view-book'
);
export const stillePostBookClosed = createAction('stille-post/book-closed');
