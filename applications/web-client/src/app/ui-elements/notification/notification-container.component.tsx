import * as React from 'react';
import { useState } from 'react';
import Notification from './notification.component';
import { NotificationContext } from './notification.context';

const NotificationContainer = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = content => {
    setNotifications([...notifications, content]);
  };

  const removeNotification = content => {
    setNotifications(notifications.filter(n => n !== content));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      {notifications.map((n, i) => (
        <Notification key={i}>{n}</Notification>
      ))}
    </NotificationContext.Provider>
  );
};

export default NotificationContainer;
