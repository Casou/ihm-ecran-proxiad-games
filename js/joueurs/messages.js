const MESSAGE_FADE_DURATION = 1000;

const incomingMessage = (message) => {
	readMessage("Nouveau message entrant");
	setTimeout(() => {
		$('main').fadeOut(MESSAGE_FADE_DURATION, () => {
			setTimeout(() => {
				$('#message #message_content').html(message);
				$('#message').fadeIn(MESSAGE_FADE_DURATION);
				readMessage(message, () => {
					setTimeout(() => {
						$('#message').fadeOut(MESSAGE_FADE_DURATION, () => $('main').fadeIn(MESSAGE_FADE_DURATION));
					}, MESSAGE_FADE_DURATION);
				});
			}, 500);
		});
	}, 1000);
};