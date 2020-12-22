import React from 'react';
import { useSelector } from 'react-redux';
import { selectStillePostBooks } from '../../../../store/selectors/stille-post';
import { Book, PageType } from '../../../../contracts/stille-post-page';
import './book-list.component.css';
import i18n from 'es2015-i18n-tag';
import { selectPlayerById } from '../../../../store/selectors/lobby';
import { openBook } from '../stille-post-api';

const StillePostBookList = () => {
  const books = useSelector(selectStillePostBooks);

  return (
    <div className="game-stille-post__book-list">
      {books.map(book => (
        <BookItem book={book} key={book.id} />
      ))}
    </div>
  );
};

const BookItem = ({ book }: { book: Book }) => {
  const firstPage = book.pages[0];
  const player = useSelector(selectPlayerById(firstPage.playerId));

  return (
    <button className="game-stille-post__book card" onClick={() => openBook(book.id)}>
      {firstPage.type === PageType.Text && <h3>{firstPage.content}</h3>}
      {firstPage.type === PageType.Draw && <img src={`/api/image/${firstPage.content}`} />}
      <span>{i18n('stille-post')`by ${player.name}`}</span>
    </button>
  );
};

export default StillePostBookList;
