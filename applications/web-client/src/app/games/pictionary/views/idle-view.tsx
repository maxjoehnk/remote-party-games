import { useSelector } from 'react-redux';
import {
  selectPictionaryCurrentPlayer,
  selectPictionaryCurrentRound,
} from '../../../../store/selectors/pictionary';
import i18n from 'es2015-i18n-tag';
import React from 'react';

const PictionaryIdleView = () => {
  const player = useSelector(selectPictionaryCurrentPlayer);

  return (
    <div className="pictionary-idle-view">{i18n('pictionary')`Waiting for ${player.name}`}</div>
  );
};

export default PictionaryIdleView;
