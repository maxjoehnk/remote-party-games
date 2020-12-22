import React from 'react';
import './stille-post-game.component.css';
import { useSelector } from 'react-redux';
import {
  selectStillePostCurrentPage,
  selectStillePostRunning,
  selectStillePostOpenBook,
} from '../../../store/selectors/stille-post';
import GameHeader from '../../game-widgets/header/game-header';
import StillePostEditor from './editor/editor.component';
import StillePostBookList from './book-list/book-list.component';
import StillePostViewBook from './view-book/view-book.component';
import StillePostPlayerList from './stille-post-player-list.component';

const StillePostGame = () => {
  const currentPage = useSelector(selectStillePostCurrentPage);
  const running = useSelector(selectStillePostRunning);
  const openBook = useSelector(selectStillePostOpenBook);

  return (
    <div
      className={`game-stille-post ${
        currentPage?.previous == null && 'game-stille-post--first-page'
      }`}
    >
      <GameHeader className="game-stille-post__header" />
      <StillePostPlayerList />
      {running && <StillePostEditor />}
      {!running && openBook == null && <StillePostBookList />}
      {openBook != null && <StillePostViewBook book={openBook} />}
    </div>
  );
};

export default StillePostGame;
