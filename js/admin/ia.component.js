class IAPamameters {

	constructor(selector) {
		this.selector = selector;
		this.sentences = [];
		this.progressBarTexts = [];
		this.trollTexts = [];
		this.enigmaTexts = [];
		this.trollEndText = null;
		this.lastEnigmaText = null;
		this.openTerminalText = null;
	}

	addSentence(newText) {
		this.sentences.push(newText);
	}

	addProgress(newText) {
		this.progressBarTexts.push(newText);
	}

	addEnigma(newText) {
		this.enigmaTexts.push(newText);
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
		const trollToUpdate = this.trollTexts.find(s => s.id === sentence.id);
		if (trollToUpdate) {
			trollToUpdate.text = sentence.text;
		}
		if (this.trollEndText.id === sentence.id) {
			this.trollEndText.text = sentence.text;
		}
	}

	removeText(textId) {
		this.sentences = this.sentences.filter(s => s.id !== textId);
		this.progressBarTexts = this.progressBarTexts.filter(s => s.id !== textId);
		this.enigmaTexts = this.enigmaTexts.filter(s => s.id !== textId);
		this.renderAndApply();
	}

	render() {
		const iaIntroductionSentences = this._renderIAIntroduction();
		const progressBarTextList = this._renderProgressBarTextList();
		const trollTexts = this._renderTrollTexts();
		const trollEnd = this._renderTrollEndText();
		const enigmes = this._renderReactionsEnigmes();
		const lastEnigme = this._renderLastEnigme();
		const terminalOpened = this._renderTerminalOpened();

		return `<section id="sentences" class="card blue-grey darken-3">
					<h1>Phrases d'introduction de l'IA</h1>
					${ iaIntroductionSentences }
					<a class="waves-effect waves-light blue darken-4 btn-small" onClick="createSentence();"><i class="material-icons left">add</i>Ajouter une phrase</a>
				</section>
				<section id="progress_bar_texts" class="card blue-grey darken-3">
					<h1>Textes à afficher sur la progress bar</h1>
					${ progressBarTextList }
					<a class="waves-effect waves-light blue darken-4 btn-small" onClick="createProgressBarText();"><i class="material-icons left">add</i>Ajouter une phrase</a>
				</section>
				<section id="troll_text" class="card blue-grey darken-3">
					<h1>Troll - Messages avec vidéo (clés vérolées)</h1>
					<h2>Affiche et synthétise le message puis joue la vidéo. Boucle sur la dernière vidéo si les programmes sont appelés trop de fois.</h2>
					${ trollTexts }
					<h1>Troll - fin de partie (Échec)</h1>
					${ trollEnd }
				</section>
				<section id="enigma_text" class="card blue-grey darken-3">
					<h1>Première ouverture du terminal</h1>
					<h2>Synthétise le message sans l'afficher.</h2>
					${ terminalOpened }
					
					<h1>Réactions énigmes (saisie d'un mot de passe correct)</h1>
					<h2>Synthétise le message sans l'afficher. Boucle sur la dernière vidéo si les programmes sont appelés trop de fois.</h2>
					${ enigmes }
					<a class="waves-effect waves-light blue darken-4 btn-small" onClick="createEnigmaText();"><i class="material-icons left">add</i>Ajouter une phrase</a>
					
					<h1>Dernière énigme résolue</h1>
					<h2>Synthétise le message sans l'afficher.</h2>
					${ lastEnigme }
				</section>
		`;
	}

	renderAndApply() {
		$(this.selector).html(this.render());
	}

	_renderIAIntroduction() {
		return `<ul>
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
				</ul>`;
	}

	_renderProgressBarTextList() {
		let progressBarTextList = '<ul>';
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
		progressBarTextList += '</ul>';
		return progressBarTextList;
	}

	_renderTrollTexts() {
		return `<ul>
					${ this.trollTexts.map(sentence => `
						<li>
							<div class="input-field">
								<label for="troll_${ sentence.id }"
										class="${ sentence.text ? "active" : "" }">
										${ sentence.videoName }
								</label>
								<input type="text"
										id="troll_${ sentence.id }" 
										value="${ sentence.text }"
										onKeyPress="return preventBadCharacter(event)"
										onChange="updateTrollText(${ sentence.id }, this.value);" />
							</div>
							<div class="input-field">
								<select id="troll_voice_${ sentence.id }" onChange="updateTrollVoice(${ sentence.id }, this.value);">
									${ ALL_VOICES.map(voice => `<option value="${ voice.voiceURI }" ${ sentence.voice === voice.voiceURI && "selected" }>${ voice.voiceURI }</option>`).join("") }							
								</select>
							</div>
							<a class="waves-effect waves-light blue lighten-1 btn-small" onClick="testTroll(${ sentence.id });"><i class="material-icons left">volume_up</i>Tester</a>
						</li>`).join("") }
				</ul>`;
	}

	_renderTrollEndText() {
		return `<div class="input-field">
					<input type="text"
							id="troll_${ this.trollEndText.id }" 
							value="${ this.trollEndText.text }"
							onKeyPress="return preventBadCharacter(event)"
							onChange="updateTrollEnd(${ this.trollEndText.id }, this.value);" />
				</div>
				<div class="input-field">
					<select id="troll_voice_${ this.trollEndText.id }" onChange="updateTrollEndVoice(${ this.trollEndText.id }, this.value);">
						${ ALL_VOICES.map(voice => `<option value="${ voice.voiceURI }" ${ this.trollEndText.voice === voice.voiceURI && "selected" }>${ voice.voiceURI }</option>`).join("") }							
					</select>
				</div>
				<a class="waves-effect waves-light blue lighten-1 btn-small" onClick="testTroll(${ this.trollEndText.id });"><i class="material-icons left">volume_up</i>Tester</a>
			`;
	}

	_renderReactionsEnigmes() {
		return `<ul>
					${ this.enigmaTexts.map(sentence => `
						<li>
							<div class="input-field">
								<input type="text"
										id="enigma_${ sentence.id }" 
										value="${ sentence.text }"
										onKeyPress="return preventBadCharacter(event)"
										onChange="updateEnigmaText(${ sentence.id }, this.value);" />
							</div>
							<div class="input-field">
								<select id="enigma_voice_${ sentence.id }" onChange="updateEnigmaVoice(${ sentence.id }, this.value);">
									${ ALL_VOICES.map(voice => `<option value="${ voice.voiceURI }" ${ sentence.voice === voice.voiceURI && "selected" }>${ voice.voiceURI }</option>`).join("") }							
								</select>
							</div>
							<i class="material-icons delete" onClick="deleteText(${ sentence.id });">delete_forever</i>
							<a class="waves-effect waves-light blue lighten-1 btn-small" onClick="testEnigma(${ sentence.id });"><i class="material-icons left">volume_up</i>Tester</a>
						</li>`).join("") }
				</ul>`;
	}

	_renderLastEnigme() {
		return `<div class="input-field">
					<input type="text"
							id="troll_${ this.lastEnigmaText.id }" 
							value="${ this.lastEnigmaText.text }"
							onKeyPress="return preventBadCharacter(event)"
							onChange="updateLastEnigmaText(${ this.lastEnigmaText.id }, this.value);" />
				</div>
				<div class="input-field">
					<select id="troll_voice_${ this.lastEnigmaText.id }" onChange="updateLastEnigmaVoice(${ this.lastEnigmaText.id }, this.value);">
						${ ALL_VOICES.map(voice => `<option value="${ voice.voiceURI }" ${ this.lastEnigmaText.voice === voice.voiceURI && "selected" }>${ voice.voiceURI }</option>`).join("") }							
					</select>
				</div>
				<a class="waves-effect waves-light blue lighten-1 btn-small" onClick="testTroll(${ this.lastEnigmaText.id });"><i class="material-icons left">volume_up</i>Tester</a>
			`;
	}

	_renderTerminalOpened() {
		return `<div class="input-field">
					<input type="text"
							id="troll_${ this.openTerminalText.id }" 
							value="${ this.openTerminalText.text }"
							onKeyPress="return preventBadCharacter(event)"
							onChange="updateOpenTerminalText(${ this.openTerminalText.id }, this.value);" />
				</div>
				<div class="input-field">
					<select id="troll_voice_${ this.openTerminalText.id }" onChange="updateOpenTerminalVoice(${ this.openTerminalText.id }, this.value);">
						${ ALL_VOICES.map(voice => `<option value="${ voice.voiceURI }" ${ this.openTerminalText.voice === voice.voiceURI && "selected" }>${ voice.voiceURI }</option>`).join("") }							
					</select>
				</div>
				<a class="waves-effect waves-light blue lighten-1 btn-small" onClick="testTroll(${ this.openTerminalText.id });"><i class="material-icons left">volume_up</i>Tester</a>
			`;
	}

}

const preventBadCharacter = (event) => {
	return event.which !== 34;
};

const testSentence = (id) => {
	readMessage($("#sentence_" + id).val(), $("#sentence_voice_" + id).val());
};
const testTroll = (id) => {
	readMessage($("#troll_" + id).val(), $("#troll_voice_" + id).val());
};
const testEnigma = (id) => {
	readMessage($("#enigma_" + id).val(), $("#enigma_voice_" + id).val());
};
