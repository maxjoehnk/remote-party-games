import Button from '../../../ui-elements/button/button.component';
import { stopRound } from '../stadt-land-fluss-api';
import Icon from '@mdi/react';
import { mdiCloseOctagonOutline } from '@mdi/js';
import i18n from 'es2015-i18n-tag';
import React from 'react';

export interface StopRoundButtonProps {
  answered: number;
  total: number;
}

const StopRoundButton = ({ answered, total }) => {
  return (
    <Button className={`game-stadt-land-fluss__stop-btn ${answered === total && 'game-stadt-land-fluss__stop-btn--ready'}`} onClick={() => stopRound()}>
      <Icon
        className="game-stadt-land-fluss__stop-btn-icon"
        size="24px"
        path={mdiCloseOctagonOutline}
      />
      {i18n('stadt-land-fluss')`Stop ${answered}/${total}`}
    </Button>
  );
};

export default StopRoundButton;
