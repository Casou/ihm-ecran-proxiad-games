const init = () => {
	$("#message").hide();
	initWebSocket();

	return Promise.all([
		retrieveAllRooms().then(updateCurrentRoomData),
		retrieveAllRiddles(),
	]);
};
