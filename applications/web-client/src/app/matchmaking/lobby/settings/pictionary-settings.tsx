import { useSelector } from 'react-redux';
import { selectGameConfig } from '../../../../store/selectors/lobby';
import { PictionaryConfiguration } from '../../../../contracts/pictionary-configuration';
import { LobbySettingsGroup } from '../lobby.component';
import i18n from 'es2015-i18n-tag';
import { updateGameConfiguration } from '../../matchmaking.api';
import React from 'react';
import './pictionary-settings.css';

const PictionarySettings = () => {
  const config: PictionaryConfiguration = useSelector(selectGameConfig);

  const updateWordList = (option: any) => updateGameConfiguration({ ...config, wordList: option });

  const setTimer = (value: number) => {
    updateGameConfiguration({
      ...config,
      timer: value,
    });
  };

  return (
    <>
      <LobbySettingsGroup label={i18n('pictionary')`Wordlist`}>
        <select
          className="select pictionary__select"
          value={config.wordList}
          onChange={e => updateWordList(e.target.value)}
        >
          <option value="pictionary_german">{i18n('pictionary')`German`}</option>
        </select>
      </LobbySettingsGroup>
      <LobbySettingsGroup label={i18n`Timer`}>
        <div className="taboo-settings__timer">
          <input
            className="input"
            type="number"
            value={config.timer}
            onChange={e => setTimer(parseInt(e.target.value, 10))}
          />
          <span>{i18n`Seconds`}</span>
        </div>
      </LobbySettingsGroup>
    </>
  );
};

export default PictionarySettings;
