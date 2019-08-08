class IAPamameters {

	constructor(selector, allTexts) {
		this.selector = selector;

		this.sentences = allTexts.filter(text => text.discriminant === "INTRO");
		this.progressBarTexts = allTexts.filter(text => text.discriminant === "PROGRESS_BAR");
		this.trollTexts = allTexts.filter(text => text.discriminant === "TROLL");
		this.trollEndText = allTexts.find(text => text.discriminant === "TROLL_END");
		this.enigmaTexts = allTexts.filter(text => text.discriminant === "ENIGMA");
		this.lastEnigmaText = allTexts.find(text => text.discriminant === "LAST_ENIGMA");
		this.openTerminalText = allTexts.find(text => text.discriminant === "OPEN_TERMINAL");
		this.tauntTexts = allTexts.filter(text => text.discriminant === "TAUNT");
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

	addTaunt(newText) {
		this.tauntTexts.push(newText);
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
		const tauntToUpdate = this.tauntTexts.find(s => s.id === sentence.id);
		if (tauntToUpdate) {
			tauntToUpdate.text = sentence.text;
			tauntToUpdate.voice = sentence.voice;
		}
	}

	removeText(textId) {
		this.sentences = this.sentences.filter(s => s.id !== textId);
		this.progressBarTexts = this.progressBarTexts.filter(s => s.id !== textId);
		this.enigmaTexts = this.enigmaTexts.filter(s => s.id !== textId);
		this.tauntTexts = this.tauntTexts.filter(s => s.id !== textId);
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
		const tauntList = this._renderTaunts();

		return `<section id="sentences" class="card blue-grey darken-3">
					<h1>Phrases d'introduction de l'IA</h1>
					<h2>Synthétise le message sans l'afficher.</h2>
					${ iaIntroductionSentences }
					<a class="waves-effect waves-light blue darken-4 btn-small full_button" onClick="createSentence();"><i class="material-icons left">add</i>Ajouter une phrase</a>
				</section>
				<section id="progress_bar_texts" class="card blue-grey darken-3">
					<h1>Textes à afficher sur la progress bar</h1>
					${ progressBarTextList }
					<a class="waves-effect waves-light blue darken-4 btn-small full_button" onClick="createProgressBarText();"><i class="material-icons left">add</i>Ajouter une phrase</a>
				</section>
				<section id="troll_text" class="card blue-grey darken-3">
					<h1>Troll - Messages avec vidéo (clés vérolées)</h1>
					<h2>Affiche et synthétise le message puis joue la vidéo. Boucle sur la dernière vidéo si les programmes sont appelés trop de fois.</h2>
					${ trollTexts }
					<h1>Troll - fin de partie (Échec)</h1>
					<h2>Synthétise le message sans l'afficher.</h2>
					${ trollEnd }
				</section>
				<section id="enigma_text" class="card blue-grey darken-3">
					<h1>Première ouverture du terminal</h1>
					<h2>Synthétise le message sans l'afficher.</h2>
					${ terminalOpened }
					
					<h1>Réactions énigmes (saisie d'un mot de passe correct)</h1>
					<h2>Synthétise le message sans l'afficher. Boucle sur la dernière vidéo si les programmes sont appelés trop de fois.</h2>
					${ enigmes }
					<a class="waves-effect waves-light blue darken-4 btn-small full_button" onClick="createEnigmaText();"><i class="material-icons left">add</i>Ajouter une phrase</a>
					
					<h1>Dernière énigme résolue</h1>
					<h2>Synthétise le message sans l'afficher.</h2>
					${ lastEnigme }
				</section>
				<section id="taunt_texts" class="card blue-grey darken-3">
					<h1>Phrases de provocation préconfigurées</h1>
					${ tauntList }
					<a class="waves-effect waves-light blue darken-4 btn-small full_button" onClick="createTauntText();"><i class="material-icons left">add</i>Ajouter une phrase</a>
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
										onKeyPress="return preventBadCharacterForSynthetizedText(event)"
										onChange="updateSentenceText(${ sentence.id }, this.value);" />
							</div>
							<div class="input-field">
								<select id="sentence_voice_${ sentence.id }" onChange="updateSentenceVoice(${ sentence.id }, this.value);">
									${ this._mapAllVoicesToOptions(sentence.voice) }
								</select>
							</div>
							<i class="material-icons delete icon_button" onClick="deleteText(${ sentence.id });">delete_forever</i>
							<a class="waves-effect waves-light blue lighten-1 btn-small full_button" onClick="testSentence(${ sentence.id });"><i class="material-icons left">volume_up</i>Tester</a>
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
					<i class="material-icons delete icon_button" onClick="deleteText(${ text.id });">delete_forever</i>
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
										onKeyPress="return preventBadCharacterForSynthetizedText(event)"
										onChange="updateTrollText(${ sentence.id }, this.value);" />
							</div>
							<div class="input-field">
								<select id="troll_voice_${ sentence.id }" onChange="updateTrollVoice(${ sentence.id }, this.value);">
									${ this._mapAllVoicesToOptions(sentence.voice) }
								</select>
							</div>
							<a class="waves-effect waves-light blue lighten-1 btn-small full_button" onClick="testTroll(${ sentence.id });"><i class="material-icons left">volume_up</i>Tester</a>
						</li>`).join("") }
				</ul>`;
	}

	_renderTrollEndText() {
		return `<div class="input-field">
					<input type="text"
							id="troll_${ this.trollEndText.id }" 
							value="${ this.trollEndText.text }"
							onKeyPress="return preventBadCharacterForSynthetizedText(event)"
							onChange="updateTrollEnd(${ this.trollEndText.id }, this.value);" />
				</div>
				<div class="input-field">
					<select id="troll_voice_${ this.trollEndText.id }" onChange="updateTrollEndVoice(${ this.trollEndText.id }, this.value);">
						${ this._mapAllVoicesToOptions(this.trollEndText.voice) }
					</select>
				</div>
				<a class="waves-effect waves-light blue lighten-1 btn-small full_button" onClick="testTroll(${ this.trollEndText.id });"><i class="material-icons left">volume_up</i>Tester</a>
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
										onKeyPress="return preventBadCharacterForSynthetizedText(event)"
										onChange="updateEnigmaText(${ sentence.id }, this.value);" />
							</div>
							<div class="input-field">
								<select id="enigma_voice_${ sentence.id }" onChange="updateEnigmaVoice(${ sentence.id }, this.value);">
									${ this._mapAllVoicesToOptions(sentence.voice) }							
								</select>
							</div>
							<i class="material-icons delete full_button" onClick="deleteText(${ sentence.id });">delete_forever</i>
							<a class="waves-effect waves-light blue lighten-1 btn-small full_button" onClick="testEnigma(${ sentence.id });"><i class="material-icons left">volume_up</i>Tester</a>
						</li>`).join("") }
				</ul>`;
	}

	_renderLastEnigme() {
		return `<div class="input-field">
					<input type="text"
							id="troll_${ this.lastEnigmaText.id }" 
							value="${ this.lastEnigmaText.text }"
							onKeyPress="return preventBadCharacterForSynthetizedText(event)"
							onChange="updateLastEnigmaText(${ this.lastEnigmaText.id }, this.value);" />
				</div>
				<div class="input-field">
					<select id="troll_voice_${ this.lastEnigmaText.id }" onChange="updateLastEnigmaVoice(${ this.lastEnigmaText.id }, this.value);">
						${ this._mapAllVoicesToOptions(this.lastEnigmaText.voice) }							
					</select>
				</div>
				<a class="waves-effect waves-light blue lighten-1 btn-small full_button" onClick="testTroll(${ this.lastEnigmaText.id });"><i class="material-icons left">volume_up</i>Tester</a>
			`;
	}

	_renderTerminalOpened() {
		return `<div class="input-field">
					<input type="text"
							id="troll_${ this.openTerminalText.id }" 
							value="${ this.openTerminalText.text }"
							onKeyPress="return preventBadCharacterForSynthetizedText(event)"
							onChange="updateOpenTerminalText(${ this.openTerminalText.id }, this.value);" />
				</div>
				<div class="input-field">
					<select id="troll_voice_${ this.openTerminalText.id }" onChange="updateOpenTerminalVoice(${ this.openTerminalText.id }, this.value);">
						${ this._mapAllVoicesToOptions(this.openTerminalText.voice) }
					</select>
				</div>
				<a class="waves-effect waves-light blue lighten-1 btn-small full_button" onClick="testTroll(${ this.openTerminalText.id });"><i class="material-icons left">volume_up</i>Tester</a>
			`;
	}

	_renderTaunts() {
		return `<ul>
					${ this.tauntTexts.map(sentence => `
						<li>
							<div class="input-field">
								<input type="text"
										id="taunt_${ sentence.id }" 
										value="${ sentence.text }"
										onKeyPress="return preventBadCharacterForSynthetizedText(event)"
										onChange="updateTauntText(${ sentence.id }, this.value);" />
							</div>
							<div class="input-field">
								<select id="taunt_voice_${ sentence.id }" onChange="updateTauntVoice(${ sentence.id }, this.value);">
									${ this._mapAllVoicesToOptions(sentence.voice) }							
								</select>
							</div>
							<i class="material-icons delete icon_button" onClick="deleteText(${ sentence.id });">delete_forever</i>
							<a class="waves-effect waves-light blue lighten-1 btn-small full_button" onClick="testTaunt(${ sentence.id });"><i class="material-icons left">volume_up</i>Tester</a>
						</li>`).join("") }
				</ul>`;
	}

  _mapAllVoicesToOptions(selectedVoice = DEFAULT_VOICE_NAME) {
    return ALL_VOICES
      .map(voice => `<option value="${ voice.name }" ${ selectedVoice === voice.name && "selected" }>${ voice.name }</option>`)
      .join("");
  }

}

const preventBadCharacterForSynthetizedText = (event) => {
	return event.which !== 34; // Caractère quote (")
};

const testSentence = (id) => {
	readMessage($("#sentence_" + id).val(), getVoice($("#sentence_voice_" + id).val()));
};
const testTroll = (id) => {
	readMessage($("#troll_" + id).val(), getVoice($("#troll_voice_" + id).val()));
};
const testTaunt = (id) => {
	readMessage($("#taunt_" + id).val(), getVoice($("#taunt_voice_" + id).val()));
};
const testEnigma = (id) => {
	readMessage($("#enigma_" + id).val(), getVoice($("#enigma_voice_" + id).val()));
};
