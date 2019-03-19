const init = () => {
	$("#message").hide();
	initWebSocket();

	return Promise.all([
		retrieveAllRooms().then(updateCurrentRoomData),
		retrieveAllRiddles(),
	]);
};

const displayAIName = () => {
	$("#ai_name").removeClass("hide");
};