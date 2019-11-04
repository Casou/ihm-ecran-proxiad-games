let IA_PARAMETERS = null;

const retrieveAITexts = () => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: SERVER_URL + "text",
			type: "GET",
			success: (allTexts) => {
				allTexts.forEach(text => text.voice = getVoice(text.voiceName));
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
		url: SERVER_URL + "text/riddle",
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


/* Update texts */
const updateSentenceText = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.sentences.find(sentence => sentence.id === id), text });
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

const updateTrollEnd = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.trollEndText, text });
};

const updateTauntText = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.tauntTexts.find(sentence => sentence.id === id), text });
};


/* Update voices */
const updateSentenceVoice = (id, voiceName) => {
	updateSentence({ ...IA_PARAMETERS.sentences.find(sentence => sentence.id === id), voiceName });
};

const updateLastEnigmaVoice = (id, voiceName) => {
	updateSentence({ ...IA_PARAMETERS.lastEnigmaText, voiceName });
};

const updateOpenTerminalVoice = (id, voiceName) => {
	updateSentence({ ...IA_PARAMETERS.openTerminalText, voiceName });
};

const updateTrollVoice = (id, voiceName) => {
	updateSentence({ ...IA_PARAMETERS.trollTexts.find(t => t.id === id), voiceName });
};

const updateEnigmaVoice = (id, voiceName) => {
	updateSentence({ ...IA_PARAMETERS.enigmaTexts.find(t => t.id === id), voiceName });
};

const updateProgressBarVoice = (id, voiceName) => {
	updateSentence({ ...IA_PARAMETERS.progressBarTexts.find(t => t.id === id), voiceName });
};

const updateTrollEndVoice = (id, voiceName) => {
	updateSentence({ ...IA_PARAMETERS.trollEndText, voiceName });
};

const updateTauntVoice = (id, voiceName) => {
	updateSentence({ ...IA_PARAMETERS.tauntTexts.find(sentence => sentence.id === id), voiceName });
};



const updateSentence = (sentence) => {
	$.ajax({
		url: SERVER_URL + "text",
		type: "PATCH",
		data : JSON.stringify({
			id: sentence.id,
			text: sentence.text,
			voiceName: sentence.voiceName
		}),
		contentType: "application/json",
		success: () => {
			IA_PARAMETERS.updateSentence(sentence);
			updateSentenceSelects();
		},
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("Error while updating sentence", sentence, xmlHttpRequest, textStatus, errorThrown);
			alert(`Error while updating sentence ${ JSON.stringify(sentence) } : \n${ textStatus }`);
		}
	});
};

const deleteText = (id) => {
	$.ajax({
		url: SERVER_URL + "text/" + id,
		type: "DELETE",
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
		// Toutes les rooms ont les mêmes selects
		const room = ROOMS[0];
		$(".selectSentences").html(room.renderVoicesSelect());
		$(".selectTaunt").html(room.renderTauntSelect());
	}
};