import React, { useEffect, useRef, useState } from 'react';
import i18n from 'es2015-i18n-tag';
import { connect, useSelector } from 'react-redux';
import './player-editor.component.css';
import { selectPlayer } from '../../store/selectors/player';
import Button from '../ui-elements/button/button.component';
import { updatePlayerName } from '../../store/actions/player';
import DrawingArea from '../game-widgets/drawing-area.component';
import { mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { fetchUserImage, updateUserImage } from './player.api';

const PlayerEditor = ({ dispatch, onSave }) => {
    const player = useSelector(selectPlayer);
    const [state, setState] = useState(player || { name: '' });

    const ref = useRef<DrawingArea>(null);

    useEffect(() => {
        fetchUserImage(player.id).then(img => ref.current.load(img));
    }, []);

    const setUsername = (name: string) => setState({ ...state, name });
    const onSubmit = () => {
        dispatch(updatePlayerName(state.name));
        ref.current
            .save()
            .then(img => updateUserImage(player.id, img))
            .catch(err => console.error(err));
        if (onSave) {
            onSave();
        }
    };

    return (
        <div className="player-editor">
            <form className="card player-editor__card" onSubmit={onSubmit}>
                <h2 className="subtitle">{i18n`Player setup`}</h2>
                <h3>{i18n`Username`}</h3>
                <input
                    autoFocus
                    className="input"
                    placeholder={i18n`Username`}
                    value={state.name}
                    onChange={e => setUsername(e.target.value)}
                />
                <h3>{i18n`Avatar`}</h3>
                <PlayerAvatarEditor ref={ref} />
                <Button type="submit" primary>{i18n`Save`}</Button>
            </form>
        </div>
    );
};

const PlayerAvatarEditor = React.forwardRef<DrawingArea>((props, ref) => {
    const clear = () => {
        ref.current.clear();
    };

    return (
        <div className="player-editor__avatar-editor">
            <DrawingArea ref={ref} width={300} height={300} thickness={4} />
            <div className="player-editor__draw-tools">
                <button type="button" onClick={() => clear()} className={`icon-button`}>
                    <Icon path={mdiTrashCan} size={1} />
                </button>
            </div>
        </div>
    );
});

export default connect()(PlayerEditor);
