import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
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
  subscribeLobbyClosed,
} from './matchmaking/matchmaking.api';
import { NotificationContainer, useNotification } from './ui-elements/notification';
import i18n from 'es2015-i18n-tag';
import { onSocketClose, onSocketOpen } from '../socket';
import GameHistory from './matchmaking/history/game-history.component';
import Footer from './footer.component';

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
      history.push(`/play/${msg.game}`);
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

const Taboo = React.lazy(() => import('./games/taboo/taboo-game.component'));
const StadtLandFluss = React.lazy(
  () => import('./games/stadt-land-fluss/stadt-land-fluss-game.component')
);
const StillePost = React.lazy(() => import('./games/stille-post/stille-post-game.component'));
const Pictionary = React.lazy(() => import('./games/pictionary/pictionary-game.component'));

const Loading = () => <div>{i18n`Loading...`}</div>;

const ApplicationRoutes = () => {
  const { pathname } = useLocation();

  return (
    <SocketListener>
      <Switch>
        <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
        <Route path="/" exact>
          <Welcome />
        </Route>
        <Route path="/lobby/:code" exact>
          <GameLobby />
        </Route>
        <Route path="/lobby/:code/history/:game" exact>
          <GameHistory />
        </Route>
        <Route path="/play/taboo">
          <Suspense fallback={<Loading />}>
            <Taboo />
          </Suspense>
        </Route>
        <Route path="/play/stadt-land-fluss">
          <Suspense fallback={<Loading />}>
            <StadtLandFluss />
          </Suspense>
        </Route>
        <Route path="/play/stille-post">
          <Suspense fallback={<Loading />}>
            <StillePost />
          </Suspense>
        </Route>
        <Route path="/play/pictionary">
          <Suspense fallback={<Loading />}>
            <Pictionary />
          </Suspense>
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
          <Footer/>
        </PlayerSetup>
      </Router>
    </NotificationContainer>
  </Provider>
);

export default App;
