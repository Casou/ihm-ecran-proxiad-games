const retrieveRiddlesData = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: SERVER_URL + "riddles",
            type: "GET",
            success: (riddles) => {
                riddles.sort((a, b) => a.name.localeCompare(b.name));
                resolve(riddles);
            },
            error: (xmlHttpRequest, textStatus, errorThrown) => {
                console.error("Status: " + textStatus);
                console.error("Error: " + errorThrown);
                reject(textStatus);
            }
        });
    });
};

const setRiddles = (riddleDatas) => {
    RIDDLES_DATAS = riddleDatas;
    ROOMS.forEach(room => {
        room.riddles = RIDDLES_DATAS;
        room.renderAndApply();
    });

    RIDDLES = [];

    riddleDatas.forEach(riddle => {
        RIDDLES.push(new Riddle(riddle));
    });

    renderRiddleTab();
};

const renderRiddleTab = () => {
    $("#riddles").html(RIDDLES
        .sort((a, b) => a.data.name.localeCompare(b.data.name))
        .map(riddle => riddle.render())
        .join(""));
    $("#riddles").append(new AddRiddle().render());
};

const newRiddle = () => {
    $.ajax({
        url: SERVER_URL + "riddle",
        type: "PUT",
        contentType: "application/json",
        success: (newRiddle) => {
            const riddle = new Riddle(newRiddle);
            RIDDLES.push(riddle);
            ROOMS.forEach(room => {
                room.riddles.push(riddle);
                room.render();
            });
            renderRiddleTab();
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
            console.error("xmlHttpRequest: ", xmlHttpRequest);
            console.error("Status: ", textStatus);
            console.error("Error: ", errorThrown);
            alert("Erreur lors de la création de l'énigme " + id + " : " + xmlHttpRequest.responseText);
        }
    });
};

const updateRiddleName = (id, value) => {
    $.ajax({
        url: SERVER_URL + "riddle/" + id + "/name",
        type: "POST",
        data : JSON.stringify({ name : value }),
        contentType: "application/json",
        success: (newRiddle) => {
            $(".riddle_" + id).tooltipster("destroy")
                .attr('title', newRiddle.name)
                .tooltipster();
            RIDDLES.filter(r => r.id === id)[0].data.name = value;

            renderRiddleTab();
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
            console.error("xmlHttpRequest: ", xmlHttpRequest);
            console.error("Status: ", textStatus);
            console.error("Error: ", errorThrown);
            alert("Erreur lors de la mise à jour de l'énigme " + id + " : " + xmlHttpRequest.responseText);
        }
    });
};

const updateRiddleId = (id, riddleId) => {
    $.ajax({
        url: SERVER_URL + "riddle/" + id + "/riddleId",
        type: "POST",
        data : JSON.stringify({ riddleId }),
        contentType: "application/json",
        success: () => {
            RIDDLES.filter(r => r.id === id)[0].data.riddleId = riddleId;
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
            console.error("xmlHttpRequest: ", xmlHttpRequest);
            console.error("Status: ", textStatus);
            console.error("Error: ", errorThrown);
            alert("Erreur lors de la mise à jour de l'énigme " + id + " : " + xmlHttpRequest.responseText);
        }
    });
};

const updateRiddlePassword = (id, riddlePassword) => {
    $.ajax({
        url: SERVER_URL + "riddle/" + id + "/riddlePassword",
        type: "POST",
        data : JSON.stringify({ riddlePassword }),
        contentType: "application/json",
        success: () => {
            RIDDLES.filter(r => r.id === id)[0].data.riddlePassword = riddlePassword;
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
            console.error("xmlHttpRequest: ", xmlHttpRequest);
            console.error("Status: ", textStatus);
            console.error("Error: ", errorThrown);
            alert("Erreur lors de la mise à jour de l'énigme " + id + " : " + xmlHttpRequest.responseText);
        }
    });
};

const deleteRiddle = (id) => {
	confirmDialog("Etes-vous sûr de vouloir supprimer cette énigme ?", () => deleteRiddleWS(id));
};

const deleteRiddleWS = (id) => {
    $.ajax({
        url: SERVER_URL + "riddle/" + id,
        type: "DELETE",
        success: () => {
            RIDDLES = RIDDLES.filter(r => r.id !== id);
            $("#riddle_" + id + ", .riddle_" + id).fadeOut(500, function() { $(this).remove() });
        },
        error: (xmlHttpRequest, textStatus, errorThrown) => {
            console.error("xmlHttpRequest: ", xmlHttpRequest);
            console.error("Status: ", textStatus);
            console.error("Error: ", errorThrown);
            alert("Erreur lors de la suppression de l'énigme " + id + " : " + xmlHttpRequest.responseText);
        }
    });
};
