const subscribeRooms = () => {
    WEBSOCKET_CLIENT.subscribe("/topic/room/connected", connectedRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/disconnected", disconnectedRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/start", startRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/startTimer", startTimerRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/pause", pauseTimerRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/riddle/unlock", unlockRiddleCallback);
};

const retrieveConnectedRooms = () => {
    $.ajax({
        url: SERVEUR_URL + "connectedRooms",
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
    $('#room_' + room.id + ' .raspberry *').attr('disabled', false);
    $('#room_' + room.id + ' .room_name').attr('disabled', true);
    $('#room_' + room.id + ' .delete_room').addClass('disabled');
	const roomsFiltered = ROOMS.filter(r => room.id === r.id);
	if (roomsFiltered && roomsFiltered.length) {
		roomsFiltered.isConnected = true;
		roomsFiltered[0].compteur.renderAndApply();
	}
};

const disconnectedRoomCallback = (room) => {
    console.log("Disconnected room", room);
    $('#room_' + room.id + ' .raspberry').addClass('disconnected');
    $('#room_' + room.id + ' .raspberry .compteurWrapper button').addClass('disabled');
	$('#room_' + room.id + ' .room_name').attr('disabled', false);
	$('#room_' + room.id + ' .delete_room').removeClass('disabled');

	const roomsFiltered = ROOMS.filter(r => room.id === r.id);
	if (roomsFiltered && roomsFiltered.length) {
		roomsFiltered[0].compteur.renderAndApply();
	}
};

const startRoomCallback = (room) => {
    console.log("startRoomCallback");
    $('#room_' + room.id + ' .raspberry .pauseButton').removeClass('disabled');
    $('#room_' + room.id + ' .raspberry .startButton').addClass('disabled');
    // $('#room_' + room.id + ' .raspberry .resetButton').addClass('disabled');
};

const startTimerRoomCallback = (room) => {
    const compteur = new Compteur('#room_' + room.id + " .raspberry .compteur");
    compteur.initTimer();
    compteur.startTime();

	const compteurWrapper = new CompteurAvecBoutons('#room_' + room.id + " .raspberry .compteurWrapper", compteur, room.id);

	$('#room_' + room.id + " .raspberry .pauseButton").removeClass("disabled");
	// $('#room_' + room.id + " .raspberry .resetButton").addClass("disabled");
	$('#room_' + room.id + " .raspberry .startButton").addClass("disabled");
	console.log("startTimerRoomCallback");

    const roomsFiltered = ROOMS.filter(r => room.id === r.id);
    if (roomsFiltered) {
        roomsFiltered[0].compteur = compteurWrapper;
    } else {
        console.error("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée", room);
        alert("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée");
    }
};

const pauseTimerRoomCallback = (room) => {
    const roomsFiltered = ROOMS.filter(r => room.id === r.id);
    if (roomsFiltered) {
        roomsFiltered[0].compteur.pauseTime();
		$('#room_' + room.id + " .raspberry .pauseButton").addClass("disabled");
		// $('#room_' + room.id + " .raspberry .resetButton").removeClass("disabled");
		$('#room_' + room.id + " .raspberry .startButton").removeClass("disabled");
    } else {
        console.error("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée", room);
        alert("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée");
    }
};

const startTimer = (id) => {
	if ($("#room_" + id + " .compteurWrapper .startButton").hasClass("disabled")) {
		return;
	}
    WEBSOCKET_CLIENT.send("/room/start", { id, remainingTime : 3600 });
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
    sendMessage(roomId, $("#room_" + roomId + " .boiteMessage textarea").val());
    $("#room_" + roomId + " .boiteMessage textarea").val("");
};

const sendMessage = (roomId, message) => {
    WEBSOCKET_CLIENT.send("/room/message", { room  : { id : roomId }, message });
};

const unlockRiddleCallback = (unlockDto) => {
    $("#room_" + unlockDto.roomId + "_riddle_" + unlockDto.id)
        .removeClass("unresolved")
        .addClass("resolved");
};