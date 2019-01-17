const init = () => {
	$("#message").hide();
	initWebSocket();
	retrieveAllRooms().then(updateCurrentRoomData);
	retrieveAllRiddles();
};

const initWebSocket = () => {
    WEBSOCKET_CLIENT = new WebSocketClient(SERVEUR_URL + "ws", { "Room" : ROOM_ID }, initWebSocket);
    subscribeAll();
};

const subscribeAll = () => {
    WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/start", () => {
        COMPTEUR.initTimer();
        COMPTEUR.startTime();
        WEBSOCKET_CLIENT.send("/room/startTimer", { id : ROOM_ID });
        $("#compteur").show();
    });
    WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/message", (messageDto) => {
		addAction(() => incomingMessage([messageDto.message]));
    });
	WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/pause", () => {
		COMPTEUR.pauseTime();
	});
	WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/reinit", () => {
		COMPTEUR.stopTime();
		$("#compteur").hide();
		localStorage.clear();
		localStorage.setItem("roomId", ROOM_ID);
		window.location.reload(false);
	});
	WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/terminate", () => {
		COMPTEUR.pauseTime();
	});
	WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/unlockRiddle", () => {
		addAction(() => resolveRiddle());
	});
	WEBSOCKET_CLIENT.subscribe("/topic/user/" + ROOM_ID + "/connected", () => {
		addAction(() => onTerminalConnect());
	});
	WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/troll", () => {
		addAction(() => troll());
	});
};
