import React from 'react';
import { useSelector } from 'react-redux';
import { selectTabooView } from '../../../store/selectors/taboo';
import TabooExplaining from './states/explaining.component';
import TabooGuessing from './states/guessing.component';
import TabooObserving from './states/observing.component';
import { TabooView } from '../../../contracts/taboo-game-configuration';
import TabooContinue from './states/continue.component';

const TabooGameArea = () => {
    const view = useSelector(selectTabooView);

    return (
        <div className="game-taboo__game-area">
            {view === TabooView.Explaining && <TabooExplaining />}
            {view === TabooView.Guessing && <TabooGuessing />}
            {view === TabooView.Observing && <TabooObserving />}
            {view === TabooView.Continue && <TabooContinue />}
        </div>
    );
};

export default TabooGameArea;
