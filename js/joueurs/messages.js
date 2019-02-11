const MESSAGE_FADE_DURATION = 1000;

const incomingMessage = (messageArray, introSentence) => {
	return new Promise(resolve => {
		readMessage(introSentence.text, introSentence.voice).then(() =>
			setTimeout(() => {
				displayAndSynthesizeMessage(messageArray).then(resolve);
			}, 1000));
	});
};

const displayAndSynthesizeMessage = (messageArray, waitTimeBeforeHideText = MESSAGE_FADE_DURATION) => {
	if (!messageArray.length) {
		return;
	}

	return new Promise(resolve => {
		$('main').fadeOut(MESSAGE_FADE_DURATION, () => {
			setTimeout(() => {
				$('#message #message_content').html(messageArray.join(" "));
				$('#message').fadeIn(MESSAGE_FADE_DURATION);

				readAllmessageArray(messageArray).then(() => {
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

async function readAllMessages(messageArray, language) {
	for (let i = 0; i < messageArray.length; i++) {
		await readMessage(messageArray[i], language);
	}
}
