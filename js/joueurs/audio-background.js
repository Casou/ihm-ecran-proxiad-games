const audioBackground = $("#audioBackground")[0];
const AUDIO_BACKGROUND_VOLUME = 0.10;
const AUDIO_BACKGROUND_VOLUME_STEP = AUDIO_BACKGROUND_VOLUME / 200;

const startAudioBackground = (startTime) => {
	let interval = null;
	return new Promise(resolve => {
		audioBackground.volume = 0;
		if (startTime) {
			audioBackground.currentTime = startTime;
		}
		audioBackground.play();
		interval = setInterval(() => raiseVolume(resolve), 100);
	}).then(() => {
		clearInterval(interval);
	});
};

const pauseAudioBackground = () => {
	return audioBackground.pause();
};

const muteAudioBackground = () => {
	let interval = null;
	return new Promise(resolve => {
		interval = setInterval(() => reduceVolume(resolve), 100);
	}).then(() => {
		clearInterval(interval);
	});
};

const reduceVolume = (resolve) => {
	const newVolume = Math.max(0, audioBackground.volume - AUDIO_BACKGROUND_VOLUME_STEP);
	audioBackground.volume = newVolume;
	if (audioBackground.volume === 0) {
		resolve();
	}
};

const raiseVolume = (resolve) => {
	audioBackground.volume += AUDIO_BACKGROUND_VOLUME_STEP;
	if (audioBackground.volume >= AUDIO_BACKGROUND_VOLUME) {
		resolve();
	}
};