import React from 'react';
import ReactDOM from 'react-dom';
import './notification.component.scss';

const element = document.getElementById('notification-container');

const Notification = ({ children }) =>
  ReactDOM.createPortal(<div className="notification">{children}</div>, element);

export default Notification;
