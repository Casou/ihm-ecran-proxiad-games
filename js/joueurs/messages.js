const MESSAGE_FADE_DURATION = 1000;

const incomingMessage = (message) => {
	return new Promise(resolve => {
		readMessage("Nouveau message entrant");
		setTimeout(() => {
			displayAndSynthesizeMessage(message).then(resolve);
		}, 1000);
	});
};

const displayAndSynthesizeMessage = (message, waitTimeBeforeHideText = MESSAGE_FADE_DURATION) => {
	return new Promise(resolve => {
		$('main').fadeOut(MESSAGE_FADE_DURATION, () => {
			setTimeout(() => {
				$('#message #message_content').html(message);
				$('#message').fadeIn(MESSAGE_FADE_DURATION);
				readMessage(message).then(() => {
					setTimeout(() => {
						$('#message').fadeOut(MESSAGE_FADE_DURATION, () => {
							$('main').fadeIn(MESSAGE_FADE_DURATION);
							resolve();
						});
					}, waitTimeBeforeHideText);
				});
			}, 500);
		});
	});
};