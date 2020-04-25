import React, { useState } from 'react';
import i18n from "es2015-i18n-tag";
import { connect, useSelector } from 'react-redux';
import './player-editor.component.css';
import { selectPlayer } from '../../store/selectors/player';
import Button from '../ui-elements/button/button.component';
import { updatePlayerName } from '../../store/actions/player';

const PlayerEditor = ({ dispatch }) => {
    const player = useSelector(selectPlayer);
    const [state, setState] = useState(player || { name: '' });

    const setUsername = (name: string) => setState({ ...state, name });

    return <div className="player-editor">
        <form className="card player-editor__card" onSubmit={() => dispatch(updatePlayerName(state.name))}>
            <h2 className="subtitle">{i18n`Player setup`}</h2>
            <input autoFocus className="input" placeholder={i18n`Username`} onInput={e => setUsername(e.target.value)}/>
            <Button type="submit" primary>{i18n`Save`}</Button>
        </form>
    </div>;
};

export default connect()(PlayerEditor);
