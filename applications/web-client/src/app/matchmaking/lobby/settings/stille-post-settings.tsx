import { useSelector } from 'react-redux';
import { selectGameConfig } from '../../../../store/selectors/lobby';
import { LobbySettingsGroup } from '../lobby.component';
import i18n from 'es2015-i18n-tag';
import React from 'react';
import { updateGameConfiguration } from '../../matchmaking.api';
import { StillePostConfig, PageConfig } from '../../../../contracts/stille-post-configuration';
import './stille-post-settings.css';

const TextOption = () => <option value={PageConfig.Text}>{i18n('stille-post')`Write`}</option>;
const ImageOption = () => <option value={PageConfig.Image}>{i18n('stille-post')`Draw`}</option>;
const RandomOption = () => <option value={PageConfig.Random}>{i18n('stille-post')`Random`}</option>;
const AlternateOption = () => (
  <option value={PageConfig.Alternate}>{i18n('stille-post')`Alternate`}</option>
);

const StillePostSettings = () => {
  const config: StillePostConfig = useSelector(selectGameConfig);

  const updateFirstPage = (option: any) =>
    updateGameConfiguration({ ...config, firstPage: option });
  const updateFollowingPages = (option: any) =>
    updateGameConfiguration({ ...config, followingPages: option });

  return (
    <>
      <LobbySettingsGroup label={i18n('stille-post')`First Page`}>
        <select
          className="select stille-post-settings__select"
          value={config.firstPage}
          onChange={e => updateFirstPage(e.target.value)}
        >
          <TextOption />
          <ImageOption />
          <RandomOption />
        </select>
      </LobbySettingsGroup>
      <LobbySettingsGroup label={i18n('stille-post')`Following Pages`}>
        <select
          className="select stille-post-settings__select"
          value={config.followingPages}
          onChange={e => updateFollowingPages(e.target.value)}
        >
          <TextOption />
          <ImageOption />
          <RandomOption />
          <AlternateOption />
        </select>
      </LobbySettingsGroup>
    </>
  );
};

export default StillePostSettings;
