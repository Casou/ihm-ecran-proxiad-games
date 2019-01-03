class WebSocketClient {

    constructor(url, headers) {
        const sockjs = new SockJS(url);
        this.stompClient = Stomp.over(sockjs);
        this.headers = headers || {};
        this.waitingSubscriptions = [];

        this.connect();
    }

    connect() {
        let that = this;
        this.stompClient.connect(this.headers, function() {
            that.waitingSubscriptions.forEach(subscribtion => that.subscribe(subscribtion.topic, subscribtion.callback));
        }, function(message) {
            console.log("disconnect", message);
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
}
