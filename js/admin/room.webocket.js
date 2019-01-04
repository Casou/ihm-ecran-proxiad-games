const subscribeRooms = () => {
    WEBSOCKET_CLIENT.subscribe("/topic/room/connected", connectedRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/disconnected", disconnectedRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/start", startRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/startTimer", startTimerRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/pauseTimer", pauseTimerRoomCallback);
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
    $('#room_' + room.id + " .raspberry").removeClass("disconnected");
    $('#room_' + room.id + " .raspberry *").attr("disabled", false);
};

const disconnectedRoomCallback = (room) => {
    console.log("Disconnected room", room);
    $('#room_' + room.id + " .raspberry").addClass("disconnected");
    $('#room_' + room.id + " .raspberry .startButton").hide();
};

const startRoomCallback = (room) => {
    console.log("startRoomCallback", room);
    $('#room_' + room.id + " .raspberry .pauseButton").show();
    $('#room_' + room.id + " .raspberry .startButton").hide();
};

const startTimerRoomCallback = (room) => {
    const compteur = new Compteur('#room_' + room.id + " .raspberry .compteur");
    compteur.initTimer();
    compteur.startTime();
    const roomsFiltered = ROOMS.filter(r => room.id === r.id);
    if (roomsFiltered) {
        roomsFiltered[0].compteur = compteur;
    } else {
        console.error("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée", room);
        alert("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée");
    }
};

const pauseTimerRoomCallback = (room) => {
	console.log("pauseTimerRoomCallback", room);
    const roomsFiltered = ROOMS.filter(r => room.id === r.id);
    if (roomsFiltered) {
        roomsFiltered[0].compteur.pauseTime();
		$('#room_' + room.id + " .raspberry .pauseButton").hide();
		$('#room_' + room.id + " .raspberry .startButton").show();
    } else {
        console.error("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée", room);
        alert("Requête START TIMER reçue mais la salle " + room.id + " n'a pas été trouvée");
    }
};

const startTimer = (id) => {
    WEBSOCKET_CLIENT.send("/room/start", { id, remainingTime : 3600 });
};

const stopTimer = (id) => {
    if (!confirm("Voulez-vous arrêter le timer pour cette salle (il ne sera pas possible de le relancer sans réinitialiser le temps) ?")) {
        return;
    }
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