const retrieveRoomsData = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: SERVEUR_URL + "rooms",
            type: "GET",
            success: (rooms) => {
                rooms.sort((a, b) => a.name.localeCompare(b.name));
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

const renderRoomTab = (rooms_data) => {
    ROOMS = [];

    rooms_data.forEach(room => {
        ROOMS.push(new Room("#rooms", room, RIDDLES_DATAS));
    });

    if (rooms_data.length < 4) {
        new AddRoom("#rooms");
    }
};

const updateRoomName = (id, value) => {
    $.ajax({
        url: SERVEUR_URL + "room/" + id + "/name",
        type: "POST",
        data : JSON.stringify({ name : value }),
        contentType: "application/json",
        success: () => {
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
            console.error("xmlHttpRequest: ", xmlHttpRequest);
            console.error("Status: ", textStatus);
            console.error("Error: ", errorThrown);
            alert("Erreur lors de la mise à jour de la salle " + id + " : " + xmlHttpRequest.responseText);
        }
    });
};