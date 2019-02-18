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
	IA_PARAMETERS = new IAPamameters("#ai", allTexts);
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

const createEnigmaText = () => {
	$.ajax({
		url: SERVER_URL + "text/enigma",
		type: "POST",
		contentType: "application/json",
		success: (newText) => {
			IA_PARAMETERS.addEnigma(newText);
			IA_PARAMETERS.renderAndApply();
		},
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("Status: " + textStatus);
			console.error("Error: " + errorThrown);
			reject(textStatus);
		}
	});
};

const createTauntText = () => {
	$.ajax({
		url: SERVER_URL + "text/taunt",
		type: "POST",
		contentType: "application/json",
		success: (sentence) => {
			IA_PARAMETERS.addTaunt(sentence);
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

const updateEnigmaText = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.enigmaTexts.find(t => t.id === id), text });
};

const updateLastEnigmaText = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.lastEnigmaText, text });
};

const updateOpenTerminalText = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.openTerminalText, text });
};

const updateLastEnigmaVoice = (id, voice) => {
	updateSentence({ ...IA_PARAMETERS.lastEnigmaText, voice });
};

const updateOpenTerminalVoice = (id, voice) => {
	updateSentence({ ...IA_PARAMETERS.openTerminalText, voice });
};

const updateTrollVoice = (id, voice) => {
	updateSentence({ ...IA_PARAMETERS.trollTexts.find(t => t.id === id), voice });
};

const updateEnigmaVoice = (id, voice) => {
	updateSentence({ ...IA_PARAMETERS.enigmaTexts.find(t => t.id === id), voice });
};

const updateTrollEnd = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.trollEndText, text });
};

const updateTrollEndVoice = (id, voice) => {
	updateSentence({ ...IA_PARAMETERS.trollEndText, voice });
};

const updateTauntText = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.tauntTexts.find(sentence => sentence.id === id), text });
};

const updateTauntVoice = (id, voice) => {
	updateSentence({ ...IA_PARAMETERS.tauntTexts.find(sentence => sentence.id === id), voice });
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