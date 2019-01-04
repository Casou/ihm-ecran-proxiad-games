const subscribeRooms = () => {
    WEBSOCKET_CLIENT.subscribe("/topic/room/connected", connectedRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/disconnected", disconnectedRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/start", startRoomCallback);
    WEBSOCKET_CLIENT.subscribe("/topic/room/all/startTimer", startTimerRoomCallback);
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
    $('#room_' + room.id + " .raspberry .startButton").show();
};

const disconnectedRoomCallback = (room) => {
    console.log("Disconnected room", room);
    $('#room_' + room.id + " .raspberry").addClass("disconnected");
    $('#room_' + room.id + " .raspberry .startButton").hide();
};

const startRoomCallback = (room) => {
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


const startTimer = (id) => {
    WEBSOCKET_CLIENT.send("/room/start", { id });
};