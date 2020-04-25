const subscribers = new Map();

export function subscribeToMessage(topic, callback) {
    const subscriberList = subscribers.get(topic);
    if (subscriberList == null) {
        subscribers.set(topic, [callback]);
    }else {
        subscriberList.push(callback);
    }
}

export function emitMessage(topic, data) {
    console.log(`[Broker] Emitting Message ${topic}`, data);
    setTimeout(() => {
        const subscriberList = subscribers.get(topic);
        if (subscriberList == null) {
            return;
        }
        for (const subscriber of subscriberList) {
            subscriber(data);
        }
    }, 0);
}