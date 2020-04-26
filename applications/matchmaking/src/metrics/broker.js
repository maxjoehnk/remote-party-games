import prometheus from 'prom-client';

const brokerMessageCounter = new prometheus.Counter({
    name: 'broker_sent_messages',
    help: 'Count of sent broker messages'
});

export function getBrokerMetrics() {
    return {
        brokerMessageCounter
    };
}