import 'babel-polyfill';
import React from 'react';
import * as ReactDom from 'react-dom';
import Modal from 'react-modal';
import App from './app/app.component';

Modal.setAppElement('#app');

ReactDom.render(<App/>, document.getElementById('app'));