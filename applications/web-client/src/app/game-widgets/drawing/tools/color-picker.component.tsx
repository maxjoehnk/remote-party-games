import React from 'react';
import { DrawingContext } from '../drawing-context';
import './color-picker.component.css';
import { mdiCheck } from '@mdi/js';
import Icon from '@mdi/react';

const colors = [
  ['#f44336', 'white'],
  ['#E91E63', 'white'],
  ['#9C27B0', 'white'],
  ['#673AB7', 'white'],
  ['#3F51B5', 'white'],
  ['#2196F3', 'white'],
  ['#03A9F4', 'white'],
  ['#00BCD4', 'white'],
  ['#009688', 'white'],
  ['#4CAF50', 'white'],
  ['#8BC34A', 'white'],
  ['#CDDC39', 'black'],
  ['#FFEB3B', 'black'],
  ['#FFC107', 'black'],
  ['#FF9800', 'black'],
  ['#FF5722', 'white'],
  ['#795548', 'white'],
  ['#9E9E9E', 'white'],
  ['#607D8B', 'white'],
  ['white', 'black'],
  ['black', 'white'],
];

const ColorPicker = ({ className }: { className?: string }) => {
  return (
    <DrawingContext.Consumer>
      {({ color: activeColor, setColor }) => (
        <div className={`color-picker ${className}`}>
          {colors.map(([color, iconColor]) => (
            <button
              type="button"
              key={color}
              style={{ backgroundColor: color }}
              className={`color-picker__color ${
                activeColor === color && 'color-picker__color--active'
              }`}
              onClick={() => setColor(color)}>
              {activeColor === color && <Icon className="color-picker__check" color={iconColor} size={1} path={mdiCheck}/>}
            </button>
          ))}
        </div>
      )}
    </DrawingContext.Consumer>
  );
};

export default ColorPicker;
