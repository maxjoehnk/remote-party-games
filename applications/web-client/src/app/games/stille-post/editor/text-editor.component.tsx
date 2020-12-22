import { connect } from 'react-redux';
import Button from '../../../ui-elements/button/button.component';
import { stillePostFinishPage } from '../../../../store/actions/stille-post';
import i18n from 'es2015-i18n-tag';
import React, { useEffect, useState } from 'react';

const TextPage = ({ dispatch, bookId }) => {
  const [state, setState] = useState('');

  useEffect(() => {
    setState('');
  }, [bookId]);

  return (
    <>
      <div className="game-stille-post__page">
        <input
          className="input game-stille-post__text-input"
          type="text"
          value={state}
          onChange={e => setState(e.target.value)}
        />
      </div>
      <Button
        className="game-stille-post__finish-page-btn"
        primary
        onClick={() => dispatch(stillePostFinishPage(state))}
      >
        {i18n('stille-post')`Finish`}
      </Button>
    </>
  );
};

export default connect()(TextPage);
