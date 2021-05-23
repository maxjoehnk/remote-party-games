import React from 'react';
import { useSelector } from 'react-redux';
import { selectTabooView } from '../../../store/selectors/taboo';
import TabooExplaining from './states/explaining.component';
import TabooGuessing from './states/guessing.component';
import TabooObserving from './states/observing.component';
import { TabooView } from '../../../contracts/taboo-game-configuration';
import TabooContinue from './states/continue.component';
import TabooWaiting from './states/waiting.component';
import i18n from 'es2015-i18n-tag';

const TabooGameArea = () => {
  const view = useSelector(selectTabooView);

  return (
    <div className="game-taboo__game-area">
      <TabooActionHint/>
      {view === TabooView.Explaining && <TabooExplaining />}
      {view === TabooView.Guessing && <TabooGuessing />}
      {view === TabooView.Observing && <TabooObserving />}
      {view === TabooView.Continue && <TabooContinue />}
      {view === TabooView.Waiting && <TabooWaiting />}
    </div>
  );
};

const TabooActionHint = () => {
  const view = useSelector(selectTabooView);
  const text = getHintForView(view);

  if (text == null) {
    return <></>;
  }

  return <span className="card game-taboo__state-hint">{text}</span>;
}

function getHintForView(view: TabooView): string {
  if (view === TabooView.Explaining) {
    return i18n('taboo')`You're explaining`;
  }
  if (view === TabooView.Guessing) {
    return i18n('taboo')`You're guessing`;
  }
  if (view === TabooView.Observing) {
    return i18n('taboo')`You're observing`;
  }
  if (view === TabooView.Continue) {
    return i18n('taboo')`You're next`;
  }
}

export default TabooGameArea;
