import 'core-js/stable';
import 'regenerator-runtime/runtime'
import React from 'react';
import * as ReactDom from 'react-dom';
import Modal from 'react-modal';
import App from './app/app.component';
import { setupInternationalization } from './i18n';

setupInternationalization();

Modal.setAppElement('#app');

ReactDom.render(<App />, document.getElementById('app'));
