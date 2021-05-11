import { connect } from 'react-redux';
import { selectPlayer } from '../store/selectors/player';
import React, { useState } from 'react';
import './header.component.css';
import i18n from 'es2015-i18n-tag';
import Modal from 'react-modal';
import PlayerEditor from './player/player-editor.component';
import { Link } from 'react-router-dom';
import PlayerAvatar from './player/player-avatar.component';
import { PlayerModel } from '../contracts/player.model';

export interface HeaderProps {
  player: PlayerModel;
}

export const Header = ({ player }: HeaderProps) => {
  const [state, setState] = useState(false);

  return (
    <>
      <div className="header">
        <Link to="/" className="header__title-link">
          <h1 className="header__title">Remote Party Games</h1>
        </Link>
        <button className="header__player-settings" onClick={() => setState(true)}>
          <span className="header__player-name">{i18n`Playing as ${player.name}`}</span>
          <PlayerAvatar className="header__player-img player-avatar--passive" player={player} />
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

const mapStateToProps = () => (state) => ({
  player: selectPlayer(state),
});

export default connect(mapStateToProps)(Header);
