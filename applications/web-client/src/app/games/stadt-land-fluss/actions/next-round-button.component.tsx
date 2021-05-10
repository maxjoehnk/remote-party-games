import Button from '../../../ui-elements/button/button.component';
import { startRound } from '../stadt-land-fluss-api';
import Icon from '@mdi/react';
import { mdiPlay } from '@mdi/js';
import i18n from 'es2015-i18n-tag';
import React from 'react';

const NextRoundButton = () => {
  return (
    <Button primary={true} className="game-stadt-land-fluss__next-btn" onClick={() => startRound()}>
      <Icon className="game-stadt-land-fluss__next-btn-icon" size="24px" path={mdiPlay} />
      {i18n('stadt-land-fluss')`Next round`}
    </Button>
  );
};

export default NextRoundButton;
