const retrieveRoomsData = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: SERVER_URL + "room",
            type: "GET",
            success: (rooms) => {
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

const setRooms = (rooms_data) => {
    ROOMS = [];

    rooms_data.forEach(room => {
        ROOMS.push(new Room(room, RIDDLES_DATAS));
    });

    renderRoomTab();
};

const renderRoomTab = () => {
    $("#rooms").html(ROOMS
        .sort((a, b) => a.data.name.localeCompare(b.data.name))
        .map(room => room.render())
        .join(""));
    $("#rooms .tooltip").tooltipster();

    if (ROOMS.length < 4) {
        $("#rooms").append(new AddRoom().render());
    }
};

const newRoom = () => {
    $.ajax({
        url: SERVER_URL + "room",
        type: "PUT",
        contentType: "application/json",
        success: (newRoom) => {
            const room = new Room(newRoom, RIDDLES_DATAS);
            ROOMS.push(room);
            renderRoomTab();
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
            console.error("xmlHttpRequest: ", xmlHttpRequest);
            console.error("Status: ", textStatus);
            console.error("Error: ", errorThrown);
			alertDialog("Erreur lors de la création de la salle " + id + " : " + xmlHttpRequest.responseText);
        }
    });
};


const updateRoomName = (id, value) => {
    $.ajax({
        url: SERVER_URL + "room/" + id + "/name",
        type: "POST",
        data : JSON.stringify({ name : value }),
        contentType: "application/json",
        success: () => {
            ROOMS.filter(r => r.id === id)[0].data.name = value;
            renderRoomTab();
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
            console.error("xmlHttpRequest: ", xmlHttpRequest);
            console.error("Status: ", textStatus);
            console.error("Error: ", errorThrown);
			alertDialog("Erreur lors de la mise à jour de la salle " + id + " : " + xmlHttpRequest.responseText);
        }
    });
};

const deleteRoom = (id) => {
	if ($('#room_' + id + ' .delete_room').hasClass("disabled")) {
		return;
	}
	confirmDialog("Etes-vous sûr de vouloir supprimer cette salle ?", () => deleteRoomAjax(id));
};

const deleteRoomAjax = (id) => {
    $.ajax({
        url: SERVER_URL + "room/" + id,
        type: "DELETE",
        contentType: "application/json",
        success: () => {
            ROOMS = ROOMS.filter(r => r.id !== id);
            $("#room_" + id).fadeOut(500, function() { $(this).remove(); renderRoomTab(); });
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
            console.error("xmlHttpRequest: ", xmlHttpRequest);
            console.error("Status: ", textStatus);
            console.error("Error: ", errorThrown);
			alertDialog("Erreur lors de la suppression de la salle " + id + " : " + xmlHttpRequest.responseText);
        }
    });
};

const reinitRoom = (id) => {
	confirmDialog("Etes-vous sûr de vouloir réinitialiser cette salle ?", () => reinitRoomAjax(id));
};

const reinitRoomAjax = (id) => {
	$.ajax({
		url: SERVER_URL + "room/" + id + "/reinit",
		type: "PATCH",
		contentType: "application/json",
		success: (room) => {
			const roomIndex = ROOMS.findIndex(r => r.id === id);
			ROOMS[roomIndex].data = room;
			ROOMS[roomIndex].compteur && ROOMS[roomIndex].compteur.reinitTime();
			$("#room_" + id + " .room").removeClass("success").removeClass("fail");
			$("#room_" + id + " .riddle").addClass("unresolved")
				.removeClass("resolved")
				.html("lock_outline");
		},
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("xmlHttpRequest: ", xmlHttpRequest);
			console.error("Status: ", textStatus);
			console.error("Error: ", errorThrown);
			alertDialog("Erreur lors de la réinitialisation de la salle " + id + " : " + xmlHttpRequest.responseText);
		}
	});
};

const refreshRoom = (id) => {
	confirmDialog("Etes-vous sûr de vouloir rafrachir l'affichage de cette salle ?", () => refreshRoomWS(id));
};

const refreshRoomWS = (id) => {
	sendRefreshCommand(id);
};