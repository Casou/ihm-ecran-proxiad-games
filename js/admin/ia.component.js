class IAPamameters {

	constructor(selector) {
		this.selector = selector;
		this.sentences = [];
		this.progressBarTexts = [];
	}

	setSentences(sentences) {
		this.sentences = sentences;
	}

	setProgress(progressBarTexts) {
		this.progressBarTexts = progressBarTexts;
	}

	addSentence(newSentence) {
		this.sentences.push(newSentence);
	}

	addProgress(newProgressBarText) {
		this.progressBarTexts.push(newProgressBarText);
	}

	updateSentence(sentence) {
		const sentenceToUpdate = this.sentences.find(s => s.id === sentence.id);
		if (sentenceToUpdate) {
			sentenceToUpdate.text = sentence.text;
			sentenceToUpdate.voice = sentence.voice;
		}
		const progressToUpdate = this.progressBarTexts.find(s => s.id === sentence.id);
		if (progressToUpdate) {
			progressToUpdate.text = sentence.text;
		}
	}

	removeText(textId) {
		this.sentences = this.sentences.filter(s => s.id !== textId);
		this.progressBarTexts = this.progressBarTexts.filter(s => s.id !== textId);
		this.renderAndApply();
	}

	render() {
		let progressBarTextList = '';
		for (let i = 0; i < this.progressBarTexts.length; i++) {
			const text = this.progressBarTexts[i];
			progressBarTextList +=
				`<li>
					<span class="progress_bar_timer">${ i * 5 } mn</span>
					<input type="text"
							maxlength="80"
							id="sentence_${ text.id }" 
							value="${ text.text }" 
							onChange="updateProgressBarText(${ text.id }, this.value);" />
					<span class="delete" onClick="deleteText(${ text.id });" />
				</li>`;
		}


		return `<section id="sentences">
					<h1>Phrases d'introduction de l'IA</h1>
						<ul>
							${ this.sentences.map(sentence => `
								<li>
									<input type="text"
											id="sentence_${ sentence.id }" 
											value="${ sentence.text }" 
											onKeyPress="return preventBadCharacter(event)" 
											onChange="updateSentenceText(${ sentence.id }, this.value);" />
									<select id="sentence_voice_${ sentence.id }" onChange="updateSentenceVoice(${ sentence.id }, this.value);">
										${ ALL_VOICES.map(voice => `<option value="${ voice.voiceURI }" ${ sentence.voice === voice.voiceURI && "selected" }>${ voice.voiceURI }</option>`).join("") }							
									</select>
									<span class="delete" onClick="deleteText(${ sentence.id });" />
									<button class="actionButton miniButton" onClick="testSentence(${ sentence.id });">Tester</button>
								</li>`).join("") }
						</ul>
						<button class="actionButton" onClick="createSentence();">Ajouter une phrase</button>
				</section>
				<section id="progress_bar_texts">
					<h1>Textes à afficher sur la progress bar</h1>
						<ul>
							${ progressBarTextList }
						</ul>
						<button class="actionButton" onClick="createProgressBarText();">Ajouter une phrase</button>
				</section>
`;
	}

	renderAndApply() {
		$(this.selector).html(this.render());
	}

}

const preventBadCharacter = (event) => {
	return event.which !== 34;
};

const testSentence = (id) => {
	readMessage($("#sentence_" + id).val(), $("#sentence_voice_" + id).val());
};