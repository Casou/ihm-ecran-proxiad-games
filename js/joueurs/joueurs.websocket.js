const initWebSocket = () => {
  WEBSOCKET_CLIENT = new WebSocketClient(SERVER_URL + "ws", {"Room": ROOM_ID}, initWebSocket);
  subscribeAll();
};

const subscribeAll = () => {
  WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/start", (room) => {
    playIntroAndStartTimer(room.remainingTime);
  });
  WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/message", (messageDto) => {
    addAction(() => incomingMessage(messageDto, messageDto.introSentence));
  });
  WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/pause", () => {
    COMPTEUR.pauseTime();
  });
  WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/reinit", () => {
    COMPTEUR.stopTime();
    reinitRoom();
  });
  WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/terminate", (room) => {
    success(room);
  });
  WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/unlockRiddle", (unlockDto) => {
    addAction(() => resolveRiddle(unlockDto));
  });
  WEBSOCKET_CLIENT.subscribe("/topic/user/" + ROOM_ID + "/connected", (userSessionDto) => {
    addAction(() => onTerminalConnect(userSessionDto));
  });
  WEBSOCKET_CLIENT.subscribe("/topic/room/" + ROOM_ID + "/troll", (roomTrollDto) => {
    addAction(() => receiveTroll(roomTrollDto, () => sendReduceTime(ROOM_ID, roomTrollDto.reduceTime)).then(refreshAfterTroll));
  });
  WEBSOCKET_CLIENT.subscribe("/topic/refresh/" + ROOM_ID, () => {
    window.location.reload(false);
  });
};

const sendCountEnded = (id) => {
  WEBSOCKET_CLIENT.send("/room/fail", {id});
};

const sendReduceTime = (id, time) => {
  WEBSOCKET_CLIENT.send("/room/reduceTime", {id, reduceTime: time});
};

const refreshAfterTroll = () => {
  retrieveAllRooms().then(() => {
    const room = ALL_ROOMS.filter(r => r.id === ROOM_ID)[0];
    const remainingTime = calculateRemainingTime(new Date(room.startTime), room.remainingTime);
    COMPTEUR.initTimer(remainingTime);
  });
};

const playIntroAndStartTimer = (remainingTime) => {
  const jqIntroVideo = $('#video video#intro');
  jqIntroVideo[0].currentTime = 0;
  jqIntroVideo.on('ended', () => {
    COMPTEUR.initTimer(remainingTime, remainingTime);
    COMPTEUR.startTime();
    WEBSOCKET_CLIENT.send("/room/startTimer", {id: ROOM_ID, startTime: new Date()});
  });
  jqIntroVideo.show();
  jqIntroVideo[0].play();
};

const success = (room) => {
  COMPTEUR.pauseTime();
  $("#compteur").fadeOut(1000, () => {
    COMPTEUR.currentTime = room.remainingTime;
    COMPTEUR.renderAndApply();

    $('#video video').hide();
    const jqFinalVideo = $('#video video#final');
    jqFinalVideo[0].currentTime = 0;
    jqFinalVideo.on('ended', () => {
      setTimeout(() => $("#compteur").removeClass("glitch").fadeIn(1000), 1000);
    });
    jqFinalVideo[0].play();
    jqFinalVideo.fadeIn(1000);
  });
};