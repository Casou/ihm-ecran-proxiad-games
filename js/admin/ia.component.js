class IAPamameters {

	constructor(selector, sentences) {
		this.selector = selector;
		this.sentences = sentences;
	}

	addSentence(newSentence) {
		this.sentences.push(newSentence);
		this.renderAndApply();
	}

	updateSentence(sentence) {
		const sentenceToUpdate = this.sentences.find(s => s.id === sentence.id);
		sentenceToUpdate.text = sentence.text;
		sentenceToUpdate.voice = sentence.voice;
	}

	removeSentence(sentence) {
		this.sentences = this.sentences.filter(s => s.id !== sentence.id);
		this.renderAndApply();
	}

	render() {
		return `<h1>Phrases d'introduction de l'IA</h1>
				<ul>
					${ this.sentences.map(sentence => `
						<li>
							<input type="text"
									id="sentence_${ sentence.id }" 
									value="${ sentence.text }" 
									onKeyPress="return preventBadCharacter(event)" 
									onChange="updateText(${ sentence.id }, this.value);" />
							<select id="sentence_voice_${ sentence.id }" onChange="updateVoice(${ sentence.id }, this.value);">
								${ ALL_VOICES.map(voice => `<option value="${ voice.voiceURI }" ${ sentence.voice === voice.voiceURI && "selected" }>${ voice.voiceURI }</option>`).join("") }							
							</select>
							<span class="delete" onClick="deleteSentence(${ sentence.id });" />
							<button class="actionButton miniButton" onClick="testSentence(${ sentence.id });">Tester</button>
						</li>`).join("") }
				</ul>
				<button class="actionButton" onClick="createSentence();">Ajouter une phrase</button>`;
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