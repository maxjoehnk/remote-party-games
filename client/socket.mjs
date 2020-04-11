const ws = new WebSocket(`ws://${window.location.host}`);

const queue = [];

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

export function emit(msg) {
    console.log('[Socket] Sending message', msg);
    const serialized = JSON.stringify(msg);
    if (ws.readyState !== ws.OPEN) {
        queue.push(serialized);
    }else {
        ws.send(serialized);
    }
}

export function onMessage(type, callback) {
    ws.addEventListener('message', e => {
        const data = JSON.parse(e.data);
        if (data.type === type) {
            callback(data);
        }
    });
}