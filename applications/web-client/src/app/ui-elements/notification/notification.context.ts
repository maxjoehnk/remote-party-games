import * as React from 'react';

interface NotificationMethods {
  addNotification?(content): void;
  removeNotification?(content): void;
}

export const NotificationContext = React.createContext<NotificationMethods>({});
