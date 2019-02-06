const initWebSocket = () => {
	WEBSOCKET_CLIENT = new WebSocketClient(SERVER_URL + "ws", { "Room" : ROOM_ID }, initWebSocket);
	subscribeAll();
};

const subscribeAll = () => {
	WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/start", (room) => {
		COMPTEUR.initTimer(room.remainingTime);
		COMPTEUR.startTime();
		WEBSOCKET_CLIENT.send("/room/startTimer", { id : ROOM_ID });
		$("#compteur").show();
	});
	WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/message", (messageDto) => {
		addAction(() => incomingMessage([messageDto.message], messageDto.introSentence));
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
	WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/troll", (roomTrollDto) => {
		addAction(() => receiveTroll(roomTrollDto, () => sendReduceTime(ROOM_ID, roomTrollDto.reduceTime)).then(refreshAfterTroll));
	});
	WEBSOCKET_CLIENT.subscribe("/topic/refresh/" + ROOM_ID, () => {
		window.location.reload(false);
	});
};

const sendCountEnded = (id) => {
	WEBSOCKET_CLIENT.send("/room/fail", { id });
};

const sendReduceTime = (id, time) => {
	WEBSOCKET_CLIENT.send("/room/reduceTime", { id, reduceTime: time });
};

const refreshAfterTroll = () => {
	retrieveAllRooms().then(() => {
		const room = ROOMS_DATA.filter(r => r.id === ROOM_ID)[0];
		const remainingTime = calculateRemainingTime(parseJavaLocalDateTimeToJsDate(room.startTime), room.remainingTime);
		COMPTEUR.initTimer(remainingTime);
	});
};