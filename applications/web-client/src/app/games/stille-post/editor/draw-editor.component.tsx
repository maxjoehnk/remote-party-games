import React, { useEffect, useRef } from 'react';
import { stillePostFinishPage } from '../../../../store/actions/stille-post';
import i18n from 'es2015-i18n-tag';
import Button from '../../../ui-elements/button/button.component';
import { connect } from 'react-redux';
import { uploadImage } from '../../../image-api';
import PencilTool from '../../../game-widgets/drawing/tools/pencil-tool.component';
import EraserTool from '../../../game-widgets/drawing/tools/eraser-tool.component';
import FillTool from '../../../game-widgets/drawing/tools/fill-tool.component';
import ClearCanvasButton from '../../../game-widgets/drawing/tools/clear-canvas-btn.component';
import DrawingArea from '../../../game-widgets/drawing/drawing-area.component';
import DrawingCanvas from '../../../game-widgets/drawing/drawing-canvas.component';
import { CanvasRef } from '../../../game-widgets/drawing/drawing-context';
import ColorPicker from '../../../game-widgets/drawing/tools/color-picker.component';

const drawAreaHeight = 400;
const drawAreaWidth = 500;

const DrawPage = ({ dispatch, bookId }) => {
  const ref = useRef<CanvasRef>(null);

  useEffect(() => {
    ref.current.clear();
  }, [bookId]);

  return (
    <>
      <div className="game-stille-post__page game-stille-post__page--draw">
        <DrawingArea>
          <div className="game-stille-post__drawing-tools">
            <PencilTool />
            <EraserTool />
            <FillTool />
            <ClearCanvasButton />
          </div>
          <DrawingCanvas ref={ref} height={drawAreaHeight} width={drawAreaWidth} />
          <div className="game-stille-post__color-picker">
            <ColorPicker />
          </div>
        </DrawingArea>
      </div>
      <Button
        className="game-stille-post__finish-page-btn"
        primary
        onClick={() =>
          ref.current
            .save()
            .then(img => uploadImage(img))
            .then(id => dispatch(stillePostFinishPage(id)))
            .catch(err => console.error(err))
        }
      >
        {i18n('stille-post')`Finish`}
      </Button>
    </>
  );
};

export default connect()(DrawPage);
