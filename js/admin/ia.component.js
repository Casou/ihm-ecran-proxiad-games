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
					<div class="input-field">
						<input type="text"
								maxlength="80"
								id="sentence_${ text.id }" 
								value="${ text.text }" 
								onChange="updateProgressBarText(${ text.id }, this.value);" />
					</div>
					<i class="material-icons delete" onClick="deleteText(${ text.id });">delete_forever</i>
				</li>`;
		}


		return `<section id="sentences" class="card blue-grey darken-3">
					<h1>Phrases d'introduction de l'IA</h1>
					<ul>
						${ this.sentences.map(sentence => `
							<li>
								<div class="input-field">
									<input type="text"
											id="sentence_${ sentence.id }" 
											value="${ sentence.text }" 
											onKeyPress="return preventBadCharacter(event)" 
											onChange="updateSentenceText(${ sentence.id }, this.value);" />
								</div>
								<div class="input-field">
									<select id="sentence_voice_${ sentence.id }" onChange="updateSentenceVoice(${ sentence.id }, this.value);">
										${ ALL_VOICES.map(voice => `<option value="${ voice.voiceURI }" ${ sentence.voice === voice.voiceURI && "selected" }>${ voice.voiceURI }</option>`).join("") }							
									</select>
								</div>
								<i class="material-icons delete" onClick="deleteText(${ sentence.id });">delete_forever</i>
								<a class="waves-effect waves-light blue lighten-1 btn-small" onClick="testSentence(${ sentence.id });"><i class="material-icons left">volume_up</i>Tester</a>
							</li>`).join("") }
					</ul>
					<a class="waves-effect waves-light blue darken-4 btn-small" onClick="createSentence();"><i class="material-icons left">add</i>Ajouter une phrase</a>
				</section>
				<section id="progress_bar_texts" class="card blue-grey darken-3">
					<h1>Textes à afficher sur la progress bar</h1>
					<ul>
						${ progressBarTextList }
					</ul>
					<a class="waves-effect waves-light blue darken-4 btn-small" onClick="createProgressBarText();"><i class="material-icons left">add</i>Ajouter une phrase</a>
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