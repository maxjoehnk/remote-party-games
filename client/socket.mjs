const ws = new WebSocket(`ws://${window.location.host}`);

const queue = [];

ws.addEventListener('open', () => {
    let msg = queue.shift();
    while (msg != null) {
        ws.send(msg);
        msg = queue.shift();
    }
});

export function emit(msg) {
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