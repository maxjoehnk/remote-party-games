import React, { useEffect, useRef, useState } from 'react';
import i18n from 'es2015-i18n-tag';
import { connect, DispatchProp, useSelector } from 'react-redux';
import { selectPlayer } from '../../store/selectors/player';
import Button from '../ui-elements/button/button.component';
import { updatePlayerName } from '../../store/actions/player';
import DrawingArea from '../game-widgets/drawing/drawing-area.component';
import { fetchUserImage, updateUserImage } from './player.api';
import DrawingCanvas from '../game-widgets/drawing/drawing-canvas.component';
import ClearCanvasButton from '../game-widgets/drawing/tools/clear-canvas-btn.component';
import PencilTool from '../game-widgets/drawing/tools/pencil-tool.component';
import EraserTool from '../game-widgets/drawing/tools/eraser-tool.component';
import './player-editor.component.css';
import { CanvasRef } from '../game-widgets/drawing/drawing-context';
import ColorPicker from '../game-widgets/drawing/tools/color-picker.component';

const PlayerEditor = ({
  dispatch,
  onSave,
  onClose,
}: DispatchProp & { onSave?: () => void; onClose?: () => void }) => {
  const player = useSelector(selectPlayer);
  const [state, setState] = useState(player || { name: '' });

  const ref = useRef<CanvasRef>(null);

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
          value={state.name || ''}
          onChange={e => setUsername(e.target.value)}
        />
        <h3>{i18n`Avatar`}</h3>
        <PlayerAvatarEditor ref={ref} />
        <div className="player-editor__actions">
          {onClose && (
            <Button
              className="player-editor__action-btn"
              type="button"
              onClick={() => onClose()}
            >{i18n`Cancel`}</Button>
          )}
          <Button className="player-editor__action-btn" type="submit" primary>{i18n`Save`}</Button>
        </div>
      </form>
    </div>
  );
};

const PlayerAvatarEditor = React.forwardRef<CanvasRef>((props, ref) => {
  return (
    <div className="player-editor__avatar-editor">
      <DrawingArea thickness={4}>
        <DrawingCanvas ref={ref} width={300} height={300} />
        <div className="player-editor__draw-tools">
          <PencilTool />
          <EraserTool />
          <ClearCanvasButton />
        </div>
        <ColorPicker className="player-editor__color-picker" />
      </DrawingArea>
    </div>
  );
});

export default connect()(PlayerEditor);
