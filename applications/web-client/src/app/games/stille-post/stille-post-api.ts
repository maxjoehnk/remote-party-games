import { emit, onMessage } from '../../../socket';
import { Book, StillePostPage } from '../../../contracts/stille-post-page';

export function finishPage(content: string, bookId: string) {
  emit({
    type: 'game/action',
    actionType: 'stille-post/finish-page',
    content,
    bookId,
  });
}

export function openBook(bookId: string) {
  emit({
    type: 'game/action',
    actionType: 'stille-post/open-book',
    bookId,
  });
}

export function viewPreviousPage(bookId: string, currentPage: number) {
  emit({
    type: 'game/action',
    actionType: 'stille-post/view-previous-page',
    bookId,
    currentPage,
  });
}

export function viewNextPage(bookId: string, currentPage: number) {
  emit({
    type: 'game/action',
    actionType: 'stille-post/view-next-page',
    bookId,
    currentPage,
  });
}

export function closeBook() {
  emit({
    type: 'game/action',
    actionType: 'stille-post/close-book',
  });
}

export function subscribeNextPage(callback: (page: StillePostPage) => void) {
  return onMessage('stille-post/next-page', msg => callback(msg.page));
}

export function subscribeBooksFinished(callback: (books: Book[]) => void) {
  return onMessage('stille-post/books-finished', msg => callback(msg.books));
}

export function subscribeViewBook(callback: (msg: { bookId: string; page: number }) => void) {
  return onMessage('stille-post/view-book', msg => callback(msg));
}

export function subscribeBookClosed(callback: () => void) {
  return onMessage('stille-post/book-closed', () => callback());
}
