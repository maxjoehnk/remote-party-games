import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import GameLobby from './matchmaking/lobby.component';
import Welcome from './welcome.component';
import store from '../store';
import { selectPlayer } from '../store/selectors/player';
import PlayerEditor from './player/player-editor.component';
import Header from './header.component';
import { subscribeGameStarted, subscribeLobbyClosed } from './matchmaking/matchmaking.api';
import TabooGame from './games/taboo/taboo-game.component';

const SocketListener = ({children}) => {
    const history = useHistory();

    useEffect(() => {
        const subscription = subscribeLobbyClosed(() => {
            history.push('/');
        });

        return () => subscription.unsubscribe();
    });

    useEffect(() => {
        const subscription = subscribeGameStarted(msg => {
            history.push('/play/taboo');
        });

        return () => subscription.unsubscribe();
    });
    return children;
};

const ApplicationRoutes = () => {
    return <SocketListener>
        <Switch>
            <Route path="/" exact><Welcome/></Route>
            <Route path="/lobby/:code" exact><GameLobby/></Route>
            <Route path="/play/taboo"><TabooGame/></Route>
        </Switch>
    </SocketListener>;
};

const PlayerSetup = ({children}) => {
    const player = useSelector(selectPlayer);

    if (player.name == null) {
        return <PlayerEditor/>;
    }
    return children;
};

const App = () => (
    <Provider store={store}>
        <Router>
            <PlayerSetup>
                <Header/>
                <ApplicationRoutes/>
            </PlayerSetup>
        </Router>
    </Provider>
);

export default App;