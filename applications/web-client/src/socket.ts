import ReconnectingWebSocket from 'reconnecting-websocket';

const isSecure = window.location.protocol === 'https:';
const wsUrl = `${isSecure ? 'wss' : 'ws'}://${window.location.host}/api/matchmaking`;

const ws = new ReconnectingWebSocket(wsUrl);

const queue = [];
let closeListeners = [];

window.addEventListener('beforeunload', () => {
    for (const listener of closeListeners) {
        ws.removeEventListener('close', listener);
    }
});

ws.addEventListener('open', () => {
    let msg = queue.shift();
    while (msg != null) {
        ws.send(msg);
        msg = queue.shift();
    }
});

ws.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    console.log('[Socket] Received message', msg);
});

ws.addEventListener('close', event => console.log('close', event));
ws.addEventListener('error', event => console.log('error', event));

export function emit(msg) {
    console.log('[Socket] Sending message', msg);
    const serialized = JSON.stringify(msg);
    if (ws.readyState !== ws.OPEN) {
        queue.push(serialized);
    } else {
        ws.send(serialized);
    }
}

export function onMessage(type, callback) {
    let listener = e => {
        const data = JSON.parse(e.data);
        if (data.type === type) {
            callback(data);
        }
    };
    ws.addEventListener('message', listener);

    return {
        unsubscribe: () => ws.removeEventListener('message', listener)
    };
}

export function onSocketOpen(callback) {
    ws.addEventListener('open', callback);

    return {
        unsubscribe: () => ws.removeEventListener('open', callback)
    };
}

export function onSocketClose(callback) {
    closeListeners.push(callback);
    ws.addEventListener('close', callback);

    return {
        unsubscribe: () => {
            ws.removeEventListener('close', callback);
            closeListeners = closeListeners.filter(c => c !== callback);
        }
    };
}
