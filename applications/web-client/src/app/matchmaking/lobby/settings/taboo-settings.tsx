import { LobbySettingsGroup } from '../lobby.component';
import React from 'react';
import i18n from 'es2015-i18n-tag';
import { useSelector } from 'react-redux';
import { selectGameConfig } from '../../../../store/selectors/lobby';
import './taboo-settings.css';
import { updateGameConfiguration } from '../../matchmaking.api';

interface TabooConfig {
  timer: number;
}

const TabooSettings = () => {
  const config: TabooConfig = useSelector(selectGameConfig);

  const setTimer = (value: number) => {
    updateGameConfiguration({
      ...config,
      timer: value
    });
  }

  return (
    <>
      <LobbySettingsGroup label={i18n`Timer`}>
        <div className="taboo-settings__timer">
          <input className="input" type="number" value={config.timer} onChange={e => setTimer(parseInt(e.target.value, 10))} />
          <span>{i18n`Seconds`}</span>
        </div>
      </LobbySettingsGroup>
    </>
  );
};

export default TabooSettings;
