const INIT_REMAINING_TIME = 3600;

const subscribeRooms = () => {
    WEBSOCKET_CLIENT.subscribe("/topic/room/connected", connectedRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/disconnected", disconnectedRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/start", startRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/startTimer", startTimerRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/reduceTime", reduceTimerRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/pause", pauseTimerRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/riddle/unlock", unlockRiddleCallback);
	WEBSOCKET_CLIENT.subscribe("/topic/room/all/success", successRoomCallback);
	WEBSOCKET_CLIENT.subscribe("/topic/room/all/fail", failRoomCallback);
	// WEBSOCKET_CLIENT.subscribe("/topic/room/all/troll", trollRoomCallback);
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

const startRoomCallback = (room) => {
    $('#room_' + room.id + ' .raspberry .pauseButton').removeClass('disabled');
    $('#room_' + room.id + ' .raspberry .startButton').addClass('disabled');
    // $('#room_' + room.id + ' .raspberry .resetButton').addClass('disabled');
};

const startTimerRoomCallback = (room) => {
    const compteur = new Compteur('#room_' + room.id + " .raspberry .compteur");
    console.log("startTimerRoomCallback", room);
    compteur.initTimer(room.remainingTime, room.remainingTime);
    compteur.startTime();

	const compteurWrapper = new CompteurAvecBoutons('#room_' + room.id + " .raspberry .compteurWrapper", compteur, room.id);

	$('#room_' + room.id + " .raspberry .pauseButton").removeClass("disabled");
	// $('#room_' + room.id + " .raspberry .resetButton").addClass("disabled");
	$('#room_' + room.id + " .raspberry .startButton").addClass("disabled");

    const roomsFiltered = ROOMS.filter(r => room.id === r.id)[0];
    if (roomsFiltered) {
		compteurWrapper.isConnected = roomsFiltered.isConnected;
		compteurWrapper.renderAndApply();
        roomsFiltered.compteur = compteurWrapper;
    } else {
        console.error("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée", room);
		alertDialog("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée");
    }
};

const reduceTimerRoomCallback = (roomTrollDto) => {
	const room = ROOMS.filter(r => roomTrollDto.id === r.id)[0];
	if (room) {
		room.compteur.animateReduceTime(roomTrollDto.reduceTime).then(() => {
			const calculatedRemainingTime = calculateRemainingTime(parseJavaLocalDateTimeToJsDate(roomTrollDto.startTime), roomTrollDto.remainingTime);
			room.compteur.initTimer(calculatedRemainingTime);
		});
	} else {
		console.error(`Requête TROLL reçue mais la salle ${ roomTrollDto.id }/${ roomTrollDto.name }  n'a pas été trouvée`, roomTrollDto);
		alertDialog(`Requête TROLL reçue mais la salle ${ roomTrollDto.id }/${ roomTrollDto.name }  n'a pas été trouvée`);
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
		alertDialog("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée");
    }
};

const startTimer = (id) => {
	if ($("#room_" + id + " .compteurWrapper .startButton").hasClass("disabled")) {
		return;
	}
    WEBSOCKET_CLIENT.send("/room/start", { id, remainingTime : parseInt(PARAMETERS["INIT_TIME"].value) });
};

const stopTimer = (id) => {
    if ($("#room_" + id + " .compteurWrapper .pauseButton").hasClass("disabled")) {
        return;
    }
    confirmDialog("Voulez-vous arrêter le timer pour cette salle (il ne sera pas possible de le relancer sans réinitialiser le temps) ?", () => stopTimerWS(id));
};
const stopTimerWS = (id) => {
    WEBSOCKET_CLIENT.send("/room/pause", { id });
};

const testMessage = (roomId) => {
    readMessage($("#room_" + roomId + " .boiteMessage textarea").val());
};

const sendMessageToRoom = (roomId) => {
	const messageTextarea = $("#room_" + roomId + " .boiteMessage textarea");
	const introSentence = IA_PARAMETERS.sentences.find(s => s.id === parseInt($("#room_" + roomId + " .boiteMessage .selectSentences").val()));
	sendMessageToSynthetize(roomId, messageTextarea.val(), introSentence);
    messageTextarea.val("");
};

const sendMessageToSynthetize = (roomId, message, introSentence) => {
    WEBSOCKET_CLIENT.send("/room/message", { room  : { id : roomId }, message, introSentence });
};

const unlockRiddleCallback = (unlockDto) => {
    $("#room_" + unlockDto.roomId + "_riddle_" + unlockDto.id)
        .removeClass("unresolved")
        .addClass("resolved")
		.html("lock_open");
};

const successRoomCallback = (room) => {
	const roomsFiltered = ROOMS.filter(r => room.id === r.id)[0];
	if (roomsFiltered) {
		roomsFiltered.compteur.terminate();
	}
	$('#room_' + room.id + ' .room').addClass("success");
};

const failRoomCallback = (room) => {
	const roomsFiltered = ROOMS.filter(r => room.id === r.id)[0];
	if (roomsFiltered) {
		roomsFiltered.compteur.terminate();
	}
	$('#room_' + room.id + ' .room').addClass("fail");
};

const sendRefreshCommand = (id) => {
	WEBSOCKET_CLIENT.send("/room/refresh", { id });
};
