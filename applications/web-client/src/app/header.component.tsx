import { useSelector } from 'react-redux';
import { selectPlayer } from '../store/selectors/player';
import React from 'react';
import './header.component.css';
import i18n from 'es2015-i18n-tag';

const Header = () => {
    const player = useSelector(selectPlayer);

    return (
        <div className="header">
            <h1 className="header__title">Remote Party Games</h1>
            <span className="header__player-name">{i18n`Playing as ${player.name}`}</span>
        </div>
    );
};

export default Header;
