const MESSAGE_FADE_DURATION = 1000;

const incomingMessage = (messageDto, introSentence) => {
	console.log("incoming message", messageDto, introSentence);
	return new Promise(resolve => {
		let introPromise = null;
		if (introSentence) {
			introPromise = readMessage(introSentence.text, introSentence.voice)
				.catch(() => {
					playJingle(resolve);
				})
		} else {
			introPromise = Promise.resolve();
		}

		introPromise.then(() => {
				setTimeout(() => {
					displayAndSynthesizeMessage(messageDto).then(resolve);
				}, 1000);
		})
	});
};

const displayAndSynthesizeMessage = (messageDto, waitTimeBeforeHideText = MESSAGE_FADE_DURATION) => {
	console.log("display", messageDto);
	if (!messageDto.message.length) {
		return;
	}

	return new Promise(resolve => {
		$('main').fadeOut(MESSAGE_FADE_DURATION, () => {
			setTimeout(() => {
				showMessage(messageDto.message);

				readAllMessages([ messageDto.message ], messageDto.voice)
					.then(() => {
						setTimeout(() => {
							hideMessage().then(resolve);
						}, waitTimeBeforeHideText);
					})
					.catch(() => {
						playJingle();
						const displayTime = calculateMessageDisplayTime(messageDto.message);
						setTimeout(() => {
							hideMessage().then(resolve);
						}, displayTime);
					});
			}, 500);
		});
	});
};

const calculateMessageDisplayTime = (message) => {
	const nbWords = message.split(" ").length || 1;
	return nbWords > 20 ? nbWords * 750
				: nbWords > 10 ? nbWords * 1000
				: nbWords * 1250;
};

const readAllMessages = (messageArray, language) => {
	return new Promise((resolve, reject) => {
		let promise = null;
		for (let i = 0; i < messageArray.length; i++) {
			promise = queuePromise(promise, (resolve, reject) => readMessage(messageArray[i], language).then(resolve).catch(reject));
		}
		promise.then(resolve).catch(reject);
	});
};


const playJingle = (resolve) => {
	const messsageAudio = $('#incomingMessage')[0];
	if (resolve) {
		messsageAudio.ended = resolve;
		messsageAudio.onerror = resolve;
	}
	messsageAudio.play();
};

const showMessage = (message) => {
	return new Promise(resolve => {
		$('#message #message_content').html(message);
		$('#message').fadeIn(MESSAGE_FADE_DURATION, () => resolve());
	});
};

const hideMessage = () => {
	return new Promise(resolve => {
		$('#message').fadeOut(MESSAGE_FADE_DURATION, () => {
			$('main').fadeIn(MESSAGE_FADE_DURATION);
			resolve();
		});
	});
};