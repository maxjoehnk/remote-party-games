const subscribers = new Map();

export function subscribe(topic, callback) {
    const subscriberList = subscribers.get(topic);
    if (subscriberList == null) {
        subscribers.set(topic, [callback]);
    }else {
        subscriberList.push(callback);
    }
}

export function emit(topic, data) {
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