let RECONNECT_TIMEOUT = 0;

class WebSocketClient {

    constructor(url, headers, onDisconnect) {
        const sockjs = new SockJS(url);
        this.stompClient = Stomp.over(sockjs);

        this.url = url;
        this.headers = headers || {};
        this.onDisconnectCallback = onDisconnect;
        this.waitingSubscriptions = [];

        this.connect();
    }

    connect() {
        let that = this;
        this.stompClient.connect(this.headers, function() {
            RECONNECT_TIMEOUT = 0;
            that.waitingSubscriptions.forEach(subscribtion => that.subscribe(subscribtion.topic, subscribtion.callback));
        }, function(message) {
            console.log("Disconnected : " + message);
            that.onDisconnect();
        });
    }

    subscribe(topic, callback) {
        if (!this.stompClient || !this.stompClient.connected) {
            this.waitingSubscriptions.push({ topic, callback });
            return;
        }

        this.stompClient.subscribe(topic, (response) => callback(JSON.parse(response.body)));
    }

    send(topic, body) {
        this.stompClient.send(topic, this.headers, JSON.stringify(body));
    }

    restart() {
        RECONNECT_TIMEOUT = 0;
        this.stompClient.disconnect(this.onDisconnect.bind(this));
    }

    onDisconnect() {
        RECONNECT_TIMEOUT = Math.min(RECONNECT_TIMEOUT + 500, 5000);
        console.log("Disconnected... trying to reconnect in " + RECONNECT_TIMEOUT + "ms");
        setTimeout(() => {
            this.onDisconnectCallback();
        }, RECONNECT_TIMEOUT);
    }

}
