let PARAMETERS = [];

const init = () => {
	$("#message").hide();
	initWebSocket();

	return Promise.all([
		retrieveAllRooms().then(updateCurrentRoomData),
		retrieveParameters()
	]);
};

const displayAIName = () => {
	$("#ai_logo").removeClass("hide");
};


const retrieveParameters = () => {
	return new Promise(resolve => {
		$.ajax({
			url: SERVER_URL + "parametre",
			type: "GET",
			success: (parametres) => {
				PARAMETERS = [];
				parametres.forEach(p => PARAMETERS[p.key] = p);
				resolve(parametres);
			},
			error: (xmlHttpRequest, textStatus, errorThrown) => {
				console.error("Status: " + textStatus);
				console.error("Error: " + errorThrown);
				reject(textStatus);
			}
		});
	});
};