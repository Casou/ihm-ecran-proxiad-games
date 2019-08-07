const subscribeRooms = () => {
  WEBSOCKET_CLIENT.subscribe("/topic/room/connected", connectedRoomCallback);
  WEBSOCKET_CLIENT.subscribe("/topic/room/disconnected", disconnectedRoomCallback);
  WEBSOCKET_CLIENT.subscribe("/topic/room/admin/start", startRoomCallback);
  WEBSOCKET_CLIENT.subscribe("/topic/room/admin/startTimer", startTimerRoomCallback);
  WEBSOCKET_CLIENT.subscribe("/topic/room/admin/reduceTime", reduceTimerRoomCallback);
  WEBSOCKET_CLIENT.subscribe("/topic/room/admin/pause", pauseTimerRoomCallback);
  WEBSOCKET_CLIENT.subscribe("/topic/riddle/unlock", unlockRiddleCallback);
  WEBSOCKET_CLIENT.subscribe("/topic/room/admin/success", successRoomCallback);
  WEBSOCKET_CLIENT.subscribe("/topic/room/admin/fail", failRoomCallback);
};

const retrieveConnectedRooms = () => {
  $.ajax({
    url: SERVER_URL + "connectedRooms",
    type: "GET",
    success: (rooms) => {
      rooms.forEach(connectedRoomCallback);
    },
    error: (xmlHttpRequest, textStatus, errorThrown) => {
      console.error("Status: " + textStatus);
      console.error("Error: " + errorThrown);
    }
  });
};

const connectedRoomCallback = (room) => {
  console.log("Connected room", room);
  $('#room_' + room.id + ' .raspberry').removeClass('disconnected');
  $('#room_' + room.id + ' .raspberry .connection_status').html("cast_connected");
  $('#room_' + room.id + ' .raspberry *').attr('disabled', false);
  $('#room_' + room.id + ' .room_name').attr('disabled', true);
  $('#room_' + room.id + ' .delete_room').addClass('disabled');
  const roomsFiltered = ROOMS.filter(r => room.id === r.id);
  if (roomsFiltered && roomsFiltered.length) {
    roomsFiltered[0].isConnected = true;
    roomsFiltered[0].compteur.isConnected = true;
    roomsFiltered[0].compteur.renderAndApply();
  }
};

const disconnectedRoomCallback = (room) => {
  console.log("Disconnected room", room);
  $('#room_' + room.id + ' .raspberry').addClass('disconnected');
  $('#room_' + room.id + ' .raspberry .connection_status').html("cast");
  $('#room_' + room.id + ' .raspberry .compteurWrapper button').addClass('disabled');
  $('#room_' + room.id + ' .room_name').attr('disabled', false);
  $('#room_' + room.id + ' .delete_room').removeClass('disabled');

  const roomsFiltered = ROOMS.filter(r => room.id === r.id)[0];
  if (roomsFiltered) {
    roomsFiltered.isConnected = false;
    roomsFiltered.compteur.isConnected = false;
    roomsFiltered.compteur.renderAndApply();
  }
};

const startRoomCallback = (startedRoom) => {
  $('#room_' + startedRoom.id + ' .raspberry .pauseButton').removeClass('disabled');
  $('#room_' + startedRoom.id + ' .raspberry .startButton').addClass('disabled');

  const room = ROOMS.find(r => startedRoom.id === r.id);
  room.volume = startedRoom.audioBackgroundVolume;
  const compteurWrapper = room.compteur;
  compteurWrapper.volume = room.volume;
  compteurWrapper.playIntro();
  compteurWrapper.renderAndApply();
};

const startTimerRoomCallback = (room) => {
  const compteur = new Compteur('#room_' + room.id + " .raspberry .compteur");
  compteur.initTimer(room.remainingTime, room.remainingTime);
  compteur.startTime();

  console.log(room.audioBackgroundVolume);

  const compteurWrapper = new CompteurAvecBoutons('#room_' + room.id + " .raspberry .compteurWrapper", compteur, room.audioBackgroundVolume, room.id, "STARTED");

  $('#room_' + room.id + " .raspberry .pauseButton").removeClass("disabled");
  $('#room_' + room.id + " .raspberry .startButton").addClass("disabled");

  const roomsFiltered = ROOMS.find(r => room.id === r.id);
  if (roomsFiltered) {
    compteurWrapper.playIntroEnd();
    compteurWrapper.isConnected = roomsFiltered.isConnected;
    compteurWrapper.renderAndApply();
    roomsFiltered.compteur = compteurWrapper;
  } else {
    console.error("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée", room);
    errorDialog("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée");
  }
};

const reduceTimerRoomCallback = (roomTrollDto) => {
  const room = ROOMS.filter(r => roomTrollDto.id === r.id)[0];
  if (room) {
    room.compteur.animateReduceTime(roomTrollDto.reduceTime).then(() => {
      const calculatedRemainingTime = calculateRemainingTime(new Date(roomTrollDto.startTime), roomTrollDto.remainingTime);
      console.warn(calculatedRemainingTime, roomTrollDto.startTime, roomTrollDto.remainingTime);
      room.compteur.initTimer(calculatedRemainingTime);
    });
  } else {
    console.error(`Requête TROLL reçue mais la salle ${roomTrollDto.id}/${roomTrollDto.name}  n'a pas été trouvée`, roomTrollDto);
    errorDialog(`Requête TROLL reçue mais la salle ${roomTrollDto.id}/${roomTrollDto.name}  n'a pas été trouvée`);
  }
};

const pauseTimerRoomCallback = (room) => {
  const roomsFiltered = ROOMS.filter(r => room.id === r.id)[0];
  if (roomsFiltered) {
    roomsFiltered.compteur.pauseTime();
    $('#room_' + room.id + " .raspberry .pauseButton").addClass("disabled");
    // $('#room_' + room.id + " .raspberry .resetButton").removeClass("disabled");
    $('#room_' + room.id + " .raspberry .startButton").removeClass("disabled");
  } else {
    console.error("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée", room);
    errorDialog("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée");
  }
};

const startTimer = (id) => {
  if ($("#room_" + id + " .compteurWrapper .startButton").hasClass("disabled")) {
    return;
  }
  WEBSOCKET_CLIENT.send("/room/start", {id, remainingTime: parseInt(PARAMETERS["INIT_TIME"].value)});
};

const stopTimer = (id) => {
  if ($("#room_" + id + " .compteurWrapper .pauseButton").hasClass("disabled")) {
    return;
  }
  confirmDialog("Voulez-vous arrêter le timer pour cette salle (il ne sera pas possible de le relancer sans réinitialiser le temps) ?", () => stopTimerWS(id));
};
const stopTimerWS = (id) => {
  WEBSOCKET_CLIENT.send("/room/pause", {id});
};

const updateVolume = (id, volume) => {
  WEBSOCKET_CLIENT.send("/room/volume", {id, audioBackgroundVolume : volume});
};

const testMessage = (roomId) => {
  readMessage($("#room_" + roomId + " .boiteMessage textarea").val());
};

const sendMessageToRoom = (roomId) => {
  const messageTextarea = $("#room_" + roomId + " .boiteMessage textarea");
  const introSentence = IA_PARAMETERS.sentences.find(s => s.id === parseInt($("#room_" + roomId + " .boiteMessage .selectSentences").val()));
  sendMessageToSynthetize(roomId, {message: messageTextarea.val()}, introSentence);
  messageTextarea.val("");
};

const sendTauntToRoom = (roomId) => {
  const taunt = IA_PARAMETERS.tauntTexts.find(s => s.id === parseInt($("#taunt_" + roomId).val()));
  sendMessageToSynthetize(roomId, {message: taunt.text, voice: taunt.voice}, null);
  $("#room_" + roomId + " .boiteTaunt .tauntLastTime span").html(new Date().toLocaleTimeString());
};

const sendMessageToSynthetize = (roomId, {message, voice}, introSentence) => {
  WEBSOCKET_CLIENT.send("/room/message", {room: {id: roomId}, message, voice, introSentence});
};

const unlockRiddleCallback = (unlockDto) => {
  $("#room_" + unlockDto.roomId + "_riddle_" + unlockDto.id)
    .removeClass("unresolved")
    .addClass("resolved")
    .html("lock_open");
};

const successRoomCallback = (room) => {
  const currentRoom = ROOMS.find(r => room.id === r.id);
  if (currentRoom) {
    currentRoom.compteur.terminate(room.remainingTime);
  }
  $('#room_' + room.id + ' .room').addClass("success");
};

const failRoomCallback = (room) => {
  const currentRoom = ROOMS.find(r => room.id === r.id);
  if (currentRoom) {
    currentRoom.compteur.terminate(0);
  }
  $('#room_' + room.id + ' .room').addClass("fail");
};

const sendRefreshCommand = (id) => {
  WEBSOCKET_CLIENT.send("/room/refresh", {id});
};
