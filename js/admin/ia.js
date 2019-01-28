let IA_PARAMETERS = null;

const retrieveSentences = () => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: SERVER_URL + "intro_sentences",
			type: "GET",
			success: (sentences) => {
				resolve(sentences);
			},
			error: (xmlHttpRequest, textStatus, errorThrown) => {
				console.error("Status: " + textStatus);
				console.error("Error: " + errorThrown);
				reject(textStatus);
			}
		});
	});
};

const setAIParameters = (sentences) => {
	IA_PARAMETERS = new IAPamameters("#sentences", sentences);
	IA_PARAMETERS.renderAndApply();
};

const createSentence = () => {
	$.ajax({
		url: SERVER_URL + "intro_sentence",
		type: "POST",
		contentType: "application/json",
		success: (sentence) => {
			IA_PARAMETERS.addSentence(sentence);
		},
		error: (xmlHttpRequest, textStatus, errorThrown) => {
			console.error("Status: " + textStatus);
			console.error("Error: " + errorThrown);
			reject(textStatus);
		}
	});
};

const updateText = (id, text) => {
	updateSentence({ ...IA_PARAMETERS.sentences.find(sentence => sentence.id === id), text });
};

const updateVoice = (id, voice) => {
	updateSentence({ ...IA_PARAMETERS.sentences.find(sentence => sentence.id === id), voice });
};

const updateSentence = (sentence) => {
	$.ajax({
		url: SERVER_URL + "intro_sentence",
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

const deleteSentence = (id) => {
	$.ajax({
		url: SERVER_URL + "intro_sentence",
		type: "DELETE",
		data : JSON.stringify({ id }),
		contentType: "application/json",
		success: () => {
			IA_PARAMETERS.removeSentence({ id });
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
		retrieveSentences().then(sentences => {
			$(".selectSentences").html(room.renderVoicesSelect(sentences));
		});
	}
};