import i18n from 'es2015-i18n-tag';
import DrawPage from './draw-editor.component';
import TextPage from './text-editor.component';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectStillePostCurrentPage } from '../../../../store/selectors/stille-post';
import { PageType } from '../../../../contracts/stille-post-page';

const StillePostEditor = () => {
  const currentPage = useSelector(selectStillePostCurrentPage);

  return (
    <>
      {currentPage == null && i18n('stille-post')`Waiting for next page`}
      {currentPage != null && (
        <>
          {currentPage.previous != null && (
            <div className="game-stille-post__previous-page game-stille-post__page-container card">
              <h3>{i18n('stille-post')`Previous Page`}</h3>
              {currentPage.previous.type == PageType.Text && (
                <p className="game-stille-post__previous-page--text">
                  {currentPage.previous.content}
                </p>
              )}
              {currentPage.previous.type == PageType.Draw && (
                <img
                  className="game-stille-post__previous-page--drawing"
                  src={`/api/image/${currentPage.previous.content}`}
                />
              )}
            </div>
          )}
          <div className="game-stille-post__next-page game-stille-post__page-container card">
            <h3>{i18n('stille-post')`Your Page`}</h3>
            {currentPage.type == PageType.Draw && <DrawPage bookId={currentPage.bookId} />}
            {currentPage.type == PageType.Text && <TextPage bookId={currentPage.bookId} />}
          </div>
        </>
      )}
    </>
  );
};

export default StillePostEditor;
