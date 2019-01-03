const subscribeRooms = () => {
    WEBSOCKET_CLIENT.subscribe("/topic/room/connected", connectedRoom);
    WEBSOCKET_CLIENT.subscribe("/topic/room/disconnected", disconnectedRoom);
};

const retrieveConnectedRooms = () => {
    $.ajax({
        url: SERVEUR_URL + "connectedRooms",
        type: "GET",
        success: (rooms) => {
            console.log("ROOMS", rooms);
            rooms.forEach(connectedRoom);
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
            console.error("Status: " + textStatus);
            console.error("Error: " + errorThrown);
        }
    });
};

const connectedRoom = (room) => {
    console.log("Connected room", room);
    $('#room_' + room.id + " .raspberry").removeClass("disconnected");
};

const disconnectedRoom = (room) => {
    console.log("Disconnected room", room);
    $('#room_' + room.id + " .raspberry").addClass("disconnected");
};
