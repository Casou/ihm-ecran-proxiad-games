const subscribeRiddles = () => {
    WEBSOCKET_CLIENT.subscribe("/topic/user/connected", terminalConnected);
    WEBSOCKET_CLIENT.subscribe("/topic/user/disconnected", terminalDisconnected);
    WEBSOCKET_CLIENT.subscribe("/topic/riddle/terminalCommand", newTerminalCommand);
};

const retrieveConnectedUsers = () => {
	$.ajax({
		url: SERVEUR_URL + "connectedUsers",
		type: "GET",
		success: (users) => {
			users.forEach(terminalConnected);
		},
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("Status: " + textStatus);
			console.error("Error: " + errorThrown);
		}
	});
};


const terminalConnected = (userSessionDto) => {
    console.log("Connected terminal", userSessionDto);
	$('#room_' + userSessionDto.roomId + " .riddlePc").removeClass("disconnected");
	$('#room_' + userSessionDto.roomId + " .riddlePc *").attr("disabled", false);

	$('#room_' + userSessionDto.roomId + " .riddlePc .terminal").html("$ > ");
	console.log(userSessionDto.commands);
	userSessionDto.commands.forEach(newTerminalCommand);
};

const terminalDisconnected = (userSessionDto) => {
    console.log("Disconnected terminal", userSessionDto);
	$('#room_' + userSessionDto.roomId + " .riddlePc").addClass("disconnected");
	$('#room_' + userSessionDto.roomId + " .riddlePc *").attr("disabled", true);
};

const newTerminalCommand = (terminalCommand) => {
    console.log("Terminal command", terminalCommand);
	let terminal = $('#room_' + terminalCommand.roomId + " .riddlePc .terminal");
	terminal
		.append(_formatCommand(terminalCommand))
		.append("<br/>$ > ")
		.animate({scrollTop: terminal[0].scrollHeight});;
};

const _formatCommand = (terminalCommand) => {
	let result = terminalCommand.text;
	if (terminalCommand.status === "ko") {
		result = `<div class="errorCommand">${ result }</div>`;
	} else if (terminalCommand.isProgress) {
		result = `<div>[===========================>] 100%</div>${ result }`;
	}

	return `${terminalCommand.command}<br/>${ result }`;
};
