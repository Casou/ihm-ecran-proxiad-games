const retrieveAllRooms = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: SERVEUR_URL + "rooms",
            type: "GET",
            success: (rooms) => {
                ROOMS_DATA = rooms;

                $("#configuration_select").html("<option value=''>Choisir une salle</option>");

                let room = rooms.filter(r => r.id === ROOM_ID) && rooms.filter(r => r.id === ROOM_ID)[0];

				$("#configuration_select")
					.append(rooms.map(room => `<option value="${ room.id }" ${ room.id === ROOM_ID && "selected" }>${ room.name }</option>`)
						.join("")
					);

                if (!room) {
                    ROOM_ID = null;
                } else {
					updateGlitch(room.resolvedRiddles.length);
				}

                resolve(rooms);
            },
            error: (xmlHttpRequest, textStatus, errorThrown) => {
                console.error("Status: " + textStatus);
                console.error("Error: " + errorThrown);
                reject(textStatus);
            }
        });
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


const updateCurrentRoomData = () => {
	if (!ROOM_ID) {
		COMPTEUR.stopTime();
		return;
	}

	const room = ROOMS_DATA.filter(r => r.id === ROOM_ID)[0];
	if (room.startTime) {
        if (room.statusTime === "STARTED") {
			const remainingTime = calculateRemainingTime(parseJavaLocalDateTimeToJsDate(room.startTime));
			COMPTEUR.initTimer(remainingTime);
            COMPTEUR.startTime();
        } else if (room.statusTime === "PAUSED") {
			COMPTEUR.isStarted = true;
			COMPTEUR.initTimer(room.remainingTime);
			COMPTEUR.pauseTime();
        }
        COMPTEUR.render();
    }
};
