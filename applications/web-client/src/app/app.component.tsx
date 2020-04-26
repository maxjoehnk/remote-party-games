import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import GameLobby from './matchmaking/lobby/lobby.component';
import Welcome from './welcome.component';
import store from '../store';
import { selectPlayer } from '../store/selectors/player';
import PlayerEditor from './player/player-editor.component';
import Header from './header.component';
import {
    subscribeGameStarted,
    subscribeGameStopped,
    subscribeLobbyClosed
} from './matchmaking/matchmaking.api';
import TabooGame from './games/taboo/taboo-game.component';
import { NotificationContainer, useNotification } from './ui-elements/notification';
import i18n from 'es2015-i18n-tag';
import { onSocketClose, onSocketOpen } from '../socket';

let clearNotification;

const SocketListener = ({ children }) => {
    const history = useHistory();
    const showPermanentNotification = useNotification(0);
    const showNotification = useNotification(3000);

    useEffect(() => {
        const subscription = subscribeLobbyClosed(() => {
            history.push('/');
            showNotification(i18n`Lobby was closed`);
        });

        return () => subscription.unsubscribe();
    });

    useEffect(() => {
        const subscription = subscribeGameStarted(msg => {
            history.push('/play/taboo');
        });

        return () => subscription.unsubscribe();
    });

    useEffect(() => {
        const subscription = subscribeGameStopped(msg => {
            history.push(`/lobby/${msg.code}`);
        });

        return () => subscription.unsubscribe();
    });

    useEffect(() => {
        const subscription = onSocketClose(() => {
            history.push('/');
            clearNotification = showPermanentNotification(i18n`Disconnected`);
        });

        return () => subscription.unsubscribe();
    });

    useEffect(() => {
        const subscription = onSocketOpen(() => {
            if (clearNotification != null) {
                clearNotification();
                showNotification(i18n`Reconnected`);
            }
        });

        return () => subscription.unsubscribe();
    });
    return children;
};

const ApplicationRoutes = () => {
    return (
        <SocketListener>
            <Switch>
                <Route path="/" exact>
                    <Welcome />
                </Route>
                <Route path="/lobby/:code" exact>
                    <GameLobby />
                </Route>
                <Route path="/play/taboo">
                    <TabooGame />
                </Route>
            </Switch>
        </SocketListener>
    );
};

const PlayerSetup = ({ children }) => {
    const player = useSelector(selectPlayer);

    if (player.name == null) {
        return <PlayerEditor />;
    }
    return children;
};

const App = () => (
    <Provider store={store}>
        <NotificationContainer>
            <Router>
                <PlayerSetup>
                    <Header />
                    <ApplicationRoutes />
                </PlayerSetup>
            </Router>
        </NotificationContainer>
    </Provider>
);

export default App;
