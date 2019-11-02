let NB_UNLOCKED_RIDDLES = (localStorage.getItem("nbUnlockedRiddle") && parseInt(localStorage.getItem("nbUnlockedRiddle"))) || 0;

const onTerminalConnect = (userSessionDto) => {
	return new Promise(resolve => {
		const isAlreadyPlayed = localStorage.getItem("terminalConnectMessageAlreadyRead") || false;

		if (!isAlreadyPlayed) {
			readAllMessages([ userSessionDto.message.text ], userSessionDto.message.voice).then(() => {
				localStorage.setItem("terminalConnectMessageAlreadyRead", "true");
				resolve();
			}).catch(() => {
				incomingMessage({ message : userSessionDto.message.text, voice : userSessionDto.message.text }, {});
			});
		} else {
			resolve();
		}
	});
};

const resolveRiddle = (unlockDto) => {
	return new Promise(resolve => {
		setTimeout(() => {
			readAllMessages([ unlockDto.message ], unlockDto.voice).then(() => {
				updateGlitch(unlockDto.nbRiddlesResolved);
				resolve();
			}).catch(() => {
				incomingMessage({ message: unlockDto.message, voice: unlockDto.voice }, {});
				updateGlitch(unlockDto.nbRiddlesResolved);
				resolve();
			});
		}, 3000);
	});
};

const updateGlitch = (nbResolvedRiddles) => {
	let glitch = $(".glitch");
	for (let i = 0; i <= nbResolvedRiddles; i++) {
		glitch.removeClass("stade" + i);
	}
	glitch.addClass("stade" + nbResolvedRiddles);
	NB_UNLOCKED_RIDDLES = nbResolvedRiddles;
	localStorage.setItem("nbUnlockedRiddle", NB_UNLOCKED_RIDDLES);
};