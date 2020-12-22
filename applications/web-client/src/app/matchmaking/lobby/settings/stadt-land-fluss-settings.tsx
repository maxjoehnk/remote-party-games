import { LobbySettingsGroup } from '../lobby.component';
import React, { useState } from 'react';
import i18n from 'es2015-i18n-tag';
import { useSelector } from 'react-redux';
import { selectGameConfig } from '../../../../store/selectors/lobby';
import './stadt-land-fluss-settings.css';
import Icon from '@mdi/react';
import { mdiCloseCircle } from '@mdi/js';
import Button from '../../../ui-elements/button/button.component';
import { updateGameConfiguration } from '../../matchmaking.api';
import { StadtLandFlussConfiguration } from '../../../../contracts/stadt-land-fluss-configuration';

const StadtLandFlussSettings = () => {
  const config: StadtLandFlussConfiguration = useSelector(selectGameConfig);

  const addColumn = (column: string) => {
    const columns = [...config.columns, column];
    updateGameConfiguration({
      ...config,
      columns,
    });
  };

  const removeColumn = (column: string) => () => {
    const columns = config.columns.filter(c => c !== column);
    updateGameConfiguration({
      ...config,
      columns,
    });
  };

  return (
    <>
      <LobbySettingsGroup label={i18n`Columns`}>
        {config.columns.map(column => (
          <Column key={column} name={column} onRemove={removeColumn(column)} />
        ))}
      </LobbySettingsGroup>
      <LobbySettingsGroup label={i18n`Add Column`}>
        <AddColumn onAdd={addColumn} />
      </LobbySettingsGroup>
    </>
  );
};

const Column = ({ name, onRemove }: { name: string; onRemove: () => void }) => {
  return (
    <span className="stadt-land-fluss-settings__column">
      {name}
      <button className="icon-button icon-button--hint" onClick={onRemove}>
        <Icon size="16px" path={mdiCloseCircle} />
      </button>
    </span>
  );
};

const AddColumn = ({ onAdd }: { onAdd: (column: string) => void }) => {
  const [column, setColumn] = useState('');

  return (
    <div className="stadt-land-fluss-settings__add-column">
      <input
        className="input"
        value={column}
        onChange={e => setColumn(e.target.value)}
        placeholder={i18n`Column`}
      />
      <Button
        type="submit"
        onClick={e => {
          e.preventDefault();
          onAdd(column);
          setColumn('');
        }}
      >{i18n`Add`}</Button>
    </div>
  );
};

export default StadtLandFlussSettings;
