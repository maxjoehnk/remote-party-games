import prometheus from 'prom-client';

const openSocketGauge = new prometheus.Gauge({
    name: 'websocket_open_connections',
    help: 'Count of open socket connections'
});
const socketRecvMessageCounter = new prometheus.Counter({
    name: 'websocket_received_messages',
    help: 'Count of received socket messages'
});
const socketSentMessageCounter = new prometheus.Counter({
    name: 'websocket_sent_messages',
    help: 'Count of sent socket messages'
});

export function getSocketMetrics() {
    return {
        openSocketGauge,
        socketRecvMessageCounter,
        socketSentMessageCounter
    };
}