let IA_PARAMETERS = null;

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

const setAIParameters = (allTexts) => {
	IA_PARAMETERS = new IAPamameters("#ai");
	IA_PARAMETERS.setSentences(allTexts.filter(text => text.discriminant === "INTRO"));
	IA_PARAMETERS.setProgress(allTexts.filter(text => text.discriminant === "PROGRESS_BAR"));
	IA_PARAMETERS.setTrollTexts(allTexts.filter(text => text.discriminant === "TROLL"));
	IA_PARAMETERS.setTrollEnd(allTexts.find(text => text.discriminant === "TROLL_END"));
	IA_PARAMETERS.renderAndApply();
};

const createSentence = () => {
	$.ajax({
		url: SERVER_URL + "text/intro",
		type: "POST",
		contentType: "application/json",
		success: (sentence) => {
			IA_PARAMETERS.addSentence(sentence);
			IA_PARAMETERS.renderAndApply();
		},
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("Status: " + textStatus);
			console.error("Error: " + errorThrown);
			reject(textStatus);
		}
	});
};

const createProgressBarText = () => {
	$.ajax({
		url: SERVER_URL + "text/progress",
		type: "POST",
		contentType: "application/json",
		success: (sentence) => {
			IA_PARAMETERS.addProgress(sentence);
			IA_PARAMETERS.renderAndApply();
		},
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("Status: " + textStatus);
			console.error("Error: " + errorThrown);
			reject(textStatus);
		}
	});
};

const updateSentenceText = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.sentences.find(sentence => sentence.id === id), text });
};

const updateSentenceVoice = (id, voice) => {
	updateSentence({ ...IA_PARAMETERS.sentences.find(sentence => sentence.id === id), voice });
};

const updateProgressBarText = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.progressBarTexts.find(t => t.id === id), text });
};

const updateTrollText = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.trollTexts.find(t => t.id === id), text });
};

const updateTrollVoice = (id, voice) => {
	updateSentence({ ...IA_PARAMETERS.trollTexts.find(t => t.id === id), voice });
};

const updateTrollEnd = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.trollEndText, text });
};

const updateTrollEndVoice = (id, voice) => {
	updateSentence({ ...IA_PARAMETERS.trollEndText, voice });
};

const updateSentence = (sentence) => {
	$.ajax({
		url: SERVER_URL + "text",
		type: "PATCH",
		data : JSON.stringify(sentence),
		contentType: "application/json",
		success: () => {
			updateSentenceSelects();
			IA_PARAMETERS.updateSentence(sentence);
		},
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("Status: " + textStatus);
			console.error("Error: " + errorThrown);
			reject(textStatus);
		}
	});
};

const deleteText = (id) => {
	$.ajax({
		url: SERVER_URL + "text",
		type: "DELETE",
		data : JSON.stringify({ id }),
		contentType: "application/json",
		success: () => {
			IA_PARAMETERS.removeText(id);
			updateSentenceSelects();
		},
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("Status: " + textStatus);
			console.error("Error: " + errorThrown);
			reject(textStatus);
		}
	});
};

const updateSentenceSelects = () => {
	if (ROOMS.length) {
		const room = ROOMS[0];
		retrieveAITexts().then(sentences => {
			$(".selectSentences").html(room.renderVoicesSelect(sentences));
		});
	}
};