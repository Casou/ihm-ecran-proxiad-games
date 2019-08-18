let PROGRESS_TEXTS = [];
let IS_PROGRESS_BAR_VISIBLE = false;

const retrieveAITexts = () => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: SERVER_URL + "text",
			type: "GET",
			success: (allTexts) => {
				resolve(allTexts);
			},
			error: (xmlHttpRequest, textStatus, errorThrown) => {
				console.error("Status: " + textStatus);
				console.error("Error: " + errorThrown);
				reject(textStatus);
			}
		});
	});
};

const playProgressBarJingle = () => {
	return new Promise(resolve => {
		const messageJingle = $('#progressBarMessage')[0];
		messageJingle.onended = resolve;
		messageJingle.onerror = resolve;
		messageJingle.play();
	});
};

function getProgressBarDuration() {
	return (PARAMETERS["PROGRESS_BAR_DURATION"] && parseInt(PARAMETERS["PROGRESS_BAR_DURATION"].value))
		|| 300;
}

function getCurrentProgressText(time) {
	const initialTime = parseInt(PARAMETERS["INIT_TIME"].value) || 3600;
	const duration = getProgressBarDuration();
	let index = Math.floor(Math.abs((initialTime - time) / duration)) % PROGRESS_TEXTS.length;
	return PROGRESS_TEXTS[index];
}

const checkProgressBar = (time) => {
	const duration = getProgressBarDuration();
	if (time === 0) {
		hideProgressBar();
	} else if ((time % duration) === 0) {
		const textDto = getCurrentProgressText(time);
		if (textDto) {
			readProgressMessage(textDto);
			updateProgressBar(textDto.text);
		}
	}
};

const readProgressMessage = (textDto) => {
	if (IS_PROGRESS_BAR_VISIBLE && PARAMETERS["PROGRESS_BAR_SYNTHESIS"].value === "true") {
		addAction(() => playProgressBarJingle().then(() => readMessage(textDto.text, getVoice(DEFAULT_VOICE_NAME))));
	}
};

const showProgressBar = (time) => {
	if (!$('#progress_bar_text').html()) {
		if (time >= 300) {
			const textDto = getCurrentProgressText(time);
			if (textDto) {
				updateProgressBar(textDto.text);
			}
		}
	}
	$('#progress_bar').fadeIn(500);
	IS_PROGRESS_BAR_VISIBLE = true;
};

const updateProgressBar = (text) => {
	$('#progress_bar').removeClass("animated");
	$('#progress_bar_text').html(text);
	setTimeout(() => {
		const progressBarDuration = getProgressBarDuration();
		$('#progress_bar').addClass("animated");
		$('#progress_bar #progress').css("animation-duration", progressBarDuration + "s");
	}, 30);
};

const hideProgressBar = () => {
	$('#progress_bar').fadeOut(500, () => {
		$('#progress_bar').removeClass("animated");
	});
	IS_PROGRESS_BAR_VISIBLE = false;
};