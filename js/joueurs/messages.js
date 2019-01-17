const MESSAGE_FADE_DURATION = 1000;

const incomingMessage = (messages) => {
	return new Promise(resolve => {
		readMessage("Nouveau message entrant");
		setTimeout(() => {
			displayAndSynthesizeMessage(messages).then(resolve);
		}, 1000);
	});
};

const displayAndSynthesizeMessage = (messages, waitTimeBeforeHideText = MESSAGE_FADE_DURATION) => {
	if (!messages.length) {
		return;
	}

	return new Promise(resolve => {
		$('main').fadeOut(MESSAGE_FADE_DURATION, () => {
			setTimeout(() => {
				$('#message #message_content').html(messages.join(" "));
				$('#message').fadeIn(MESSAGE_FADE_DURATION);

				readAllMessages(messages).then(() => {
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

async function readAllMessages(messages, language) {
	for (let i = 0; i < messages.length; i++) {
		await readMessage(messages[i], language);
	}
}
