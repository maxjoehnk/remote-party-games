const ws = new WebSocket(`ws://${window.location.host}`);

export function emit(msg) {
    const serialized = JSON.stringify(msg);
    ws.send(serialized);
}

export function onMessage(type, callback) {
    ws.addEventListener('message', e => {
        const data = JSON.parse(e.data);
        if (data.type === type) {
            callback(data);
        }
    });
}