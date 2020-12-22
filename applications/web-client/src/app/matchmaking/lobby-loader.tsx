import { useParams } from 'react-router-dom';
import { joinLobby } from '../../store/actions/lobby';
import React from 'react';
import { connect } from 'react-redux';

export interface GameLobbyRouteParams {
  code: string;
}

const LobbyLoader = ({ dispatch, children }) => {
  const { code } = useParams<GameLobbyRouteParams>();
  dispatch(joinLobby(code));

  return children;
};

const Loader = connect()(LobbyLoader);

export function withLobby(Component) {
  return props => (
    <Loader>
      <Component {...props} />
    </Loader>
  );
}

export default Loader;
