let PROGRESS_TEXTS = [];

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

const checkProgressBar = (time) => {
	if (time === 0) {
		hideProgressBar();
	} else if ((time % 300) === 0) {
		const index = Math.abs(PROGRESS_TEXTS.length - Math.round(time / 300)) % PROGRESS_TEXTS.length;
		const textDto = PROGRESS_TEXTS[index];
		if (textDto) {
			showProgressBar(textDto.text);
		}
	}
};

const showProgressBar = (text) => {
	$('#progress_bar').removeClass("animated");
	$('#progress_bar_text').html(text);
	$('#progress_bar').fadeIn(500, () => {
		$('#progress_bar').addClass("animated");
	});
};

const hideProgressBar = () => {
	$('#progress_bar').fadeOut(500, () => {
		$('#progress_bar').removeClass("animated");
	});
};