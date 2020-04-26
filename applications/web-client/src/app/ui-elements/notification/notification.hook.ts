import { useContext, useEffect, useState } from 'react';
import { NotificationContext } from './notification.context';

export type NotificationCallback = (text: string) => void;

export function useNotification(timeout = 5000): NotificationCallback {
    const [state, setState] = useState(null);

    const context = useContext(NotificationContext);

    useEffect(() => {
        if (state == null) {
            return;
        }
        context.addNotification(state);
        const timeoutId = setTimeout(() => {
            context.removeNotification(state);
            setState(null);
        }, timeout);

        return () => clearTimeout(timeoutId);
    }, [state]);

    return content => setState(content);
}
