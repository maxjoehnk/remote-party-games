import { useContext, useEffect, useState } from 'react';
import { NotificationContext } from './notification.context';

export type NotificationCallback = (text: string) => void;

export function useNotification(timeout = 5000): NotificationCallback {
  const [state, setState] = useState(null);

  const context = useContext(NotificationContext);

  const dismiss = () => {
    context.removeNotification(state);
    setState(null);
  };

  useEffect(() => {
    if (state == null) {
      return;
    }
    context.addNotification(state);
    if (timeout == 0) {
      return () => dismiss();
    }
    const timeoutId = setTimeout(() => dismiss(), timeout);

    return () => {
      clearTimeout(timeoutId);
      dismiss();
    };
  }, [state]);

  return content => {
    setState(content);

    return () => dismiss();
  };
}
