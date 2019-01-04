const init = () => {
    initWebSocket();
    retrieveAllRooms();
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
    })
};

const retrieveAllRooms = () => {
    $.ajax({
        url: SERVEUR_URL + "rooms",
        type: "GET",
        success: (rooms) => {
            $("#configuration_select").html("<option value=''>Choisir une salle</option>");
            let foundRoom = false;
            rooms.forEach(room => {
                foundRoom = foundRoom || room.id === ROOM_ID;
                $("#configuration_select").append(`
                    <option value="${ room.id }" ${ room.id === ROOM_ID && "selected" }>${ room.name }</option>
                `)
            });
            if (!foundRoom) {
                ROOM_ID = null;
            }
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
            console.error("Status: " + textStatus);
            console.error("Error: " + errorThrown);
        }
    });
};

const chooseRoom = (value) => {
    ROOM_ID = parseInt(value);
    WEBSOCKET_CLIENT.headers = { "Room" : ROOM_ID };
    localStorage.setItem("roomId", ROOM_ID);

    WEBSOCKET_CLIENT.restart();
};

$(document).keydown(function(e) {
    if (e.keyCode >= 65 && e.keyCode <= 90) $('#configuration')[0].show();
    if (e.keyCode === 27) $('#configuration')[0].close();
});