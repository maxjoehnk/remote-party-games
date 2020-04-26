import React, { useRef, useState } from 'react';
import i18n from 'es2015-i18n-tag';
import { connect, useSelector } from 'react-redux';
import './player-editor.component.css';
import { selectPlayer } from '../../store/selectors/player';
import Button from '../ui-elements/button/button.component';
import { updatePlayerName } from '../../store/actions/player';
import DrawingArea, { DrawingTool } from '../game-widgets/drawing-area.component';
import { mdiEraser, mdiPen, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import { updateUserImage } from './player.api';

const PlayerEditor = ({ dispatch, onSave }) => {
    const player = useSelector(selectPlayer);
    const [state, setState] = useState(player || { name: '' });

    const ref = useRef<DrawingArea>(null);

    const setUsername = (name: string) => setState({ ...state, name });
    const onSubmit = () => {
        dispatch(updatePlayerName(state.name));
        ref.current.save()
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
                <input
                    autoFocus
                    className="input"
                    placeholder={i18n`Username`}
                    value={state.name}
                    onChange={e => setUsername(e.target.value)}
                />
                <PlayerAvatarEditor ref={ref}/>
                <Button type="submit" primary>{i18n`Save`}</Button>
            </form>
        </div>
    );
};

const PlayerAvatarEditor = React.forwardRef((props, ref) => {
    const [tool, setTool] = useState(DrawingTool.Pen);

    const clear = () => {
        ref.current.clear();
    }

    const penClass = tool === DrawingTool.Pen ? 'icon-button--active' : 'icon-button--inactive';
    const eraserClass = tool === DrawingTool.Eraser ? 'icon-button--active' : 'icon-button--inactive';

    return <div className="player-editor__avatar-editor">
        <DrawingArea ref={ref} width={300} height={300} thickness={4} tool={tool} />
        <div className="player-editor__draw-tools">
            <button type="button"
                    onClick={() => setTool(DrawingTool.Pen)}
                    className={`icon-button ${penClass}`}>
                <Icon path={mdiPen} size={1}/>
            </button>
            <button type="button"
                    onClick={() => setTool(DrawingTool.Eraser)}
                    className={`icon-button ${eraserClass}`}>
                <Icon path={mdiEraser} size={1}/>
            </button>
            <button type="button"
                    onClick={() => clear()}
                    className={`icon-button`}>
                <Icon path={mdiTrashCan} size={1}/>
            </button>
        </div>
    </div>;
})

export default connect()(PlayerEditor);
