const init = () => {
	$("#message").hide();
	initWebSocket();
	retrieveAllRooms().then(updateCurrentRoomData);
	retrieveAllRiddles();
};
