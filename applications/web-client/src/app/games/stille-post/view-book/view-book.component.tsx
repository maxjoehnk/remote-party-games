import React from 'react';
import { Page, PageType } from '../../../../contracts/stille-post-page';
import Button from '../../../ui-elements/button/button.component';
import i18n from 'es2015-i18n-tag';
import { closeBook, viewNextPage } from '../stille-post-api';
import { OpenBook } from '../../../../store/selectors/stille-post';
import { useSelector } from 'react-redux';
import { selectPlayerById } from '../../../../store/selectors/lobby';
import './view-book.component.css';

const StillePostViewBook = ({ book }: { book: OpenBook }) => {
  const pages = [...book.pages].reverse();
  return (
    <div className="game-stille-post-open-book">
      <div className="game-stille-post-open-book__actions">
        {book.hasPagesLeft && (
          <Button primary={true} onClick={() => viewNextPage(book.id, book.currentPage)}>{i18n(
            'stille-post'
          )`Next Page`}</Button>
        )}
        <Button onClick={() => closeBook()}>{i18n('stille-post')`Close Book`}</Button>
      </div>
      {pages.map(page => (
        <ViewPage page={page} key={page.playerId} />
      ))}
    </div>
  );
};

const ViewPage = ({ page }: { page: Page }) => {
  const player = useSelector(selectPlayerById(page.playerId));

  return (
    <div className="card game-stille-post-open-book__page">
      {page.type === PageType.Draw && (
        <img className="game-stille-post-open-book__image" src={`/api/image/${page.content}`} />
      )}
      {page.type === PageType.Text && (
        <span className="game-stille-post-open-book__text">{page.content}</span>
      )}
      <span className="game-stille-post-open-book__author">{i18n(
        'stille-post'
      )`by ${player.name}`}</span>
    </div>
  );
};

export default StillePostViewBook;
