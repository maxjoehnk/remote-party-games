import { useSelector } from 'react-redux';
import { selectPlayer } from '../store/selectors/player';
import React, { useState } from 'react';
import './header.component.css';
import i18n from 'es2015-i18n-tag';
import Modal from 'react-modal';
import PlayerEditor from './player/player-editor.component';
import { Link } from 'react-router-dom';

const Header = () => {
  const [state, setState] = useState(false);
  const player = useSelector(selectPlayer);

  return (
    <>
      <div className="header">
        <Link to="/" className="header__title-link">
          <h1 className="header__title">Remote Party Games</h1>
        </Link>
        <button className="header__player-settings" onClick={() => setState(true)}>
          <span className="header__player-name">{i18n`Playing as ${player.name}`}</span>
          <img
            className="header__player-img"
            src={`${window.location.origin}/api/image/${player.id}`}
          />
        </button>
      </div>
      <Modal
        isOpen={state}
        className="dialog"
        style={{ overlay: { background: 'rgba(0, 0, 0, 0.5)' } }}
      >
        <PlayerEditor onSave={() => setState(false)} onClose={() => setState(false)} />
      </Modal>
    </>
  );
};

export default Header;
