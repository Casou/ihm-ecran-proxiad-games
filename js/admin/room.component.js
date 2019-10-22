class Room {

	constructor(data, riddles) {
		this.id = data.id;
		this.data = data;
		this.riddles = riddles;
		this.volume = data.audioBackgroundVolume || 0.0;

		const compteurSeul = (data.startTime && new Compteur('#room_' + this.id + " .raspberry .compteur", new Date(data.startTime), data.statusTime, data.remainingTime)) || null;

		this.compteur = new CompteurAvecBoutons('#room_' + this.id + " .raspberry .compteurWrapper", compteurSeul, this.volume, this.id, false, data.statusTime);
	}

	render() {
		return `
			<div id="room_${this.id}" class="col s12 m6">
				<div class="card blue-grey darken-3 room ${ this.data.terminateStatus }">
					<div class="card-content">
						<header>
							<span class="reinit_room icon_button" title="Réinitialiser la salle" onClick="reinitRoom(${ this.id });"></span>
							<div class="input-field">
							  <input type="text" 
									class="room_name" 
									value="${ this.data.name }"
									onKeyPress="return preventBadCharacterForRoomName(event)"
									onChange="updateRoomName(${ this.id }, this.value)" />
							</div>
							<span class="delete_room icon_button" title="Supprimer la salle" onClick="deleteRoom(${ this.id });"></span>
						</header>
						<div>
							<div class="riddle_icons">
								<i id="room_${this.data.id}_entry_code" title="Entry code // TODO" class="tooltip riddle material-icons unresolved">exit_to_app</i>
								${ this.riddles.map(riddle => {
									let resolved = this.data.resolvedRiddles.filter(r => r.riddleId === riddle.riddleId).length > 0;
									return `<i id="room_${this.data.id}_riddle_${riddle.id}" 
																			title="${riddle.name} (${riddle.riddleId} / ${riddle.riddlePassword})" 
																			class="tooltip riddle material-icons riddle_${riddle.id} ${ resolved ? "resolved" : "unresolved" }">
																		${ resolved ? "lock_open" : "lock_outline" }
																	</i>`;
								  }).join(" ") }
							</div>
							<div class="riddlePc disconnected">
								<h2><i class="material-icons connection_status">cast</i> PC énigme</h2>
								<div class="terminal">
									$ >
								</div>
							</div>
							<div class="raspberry disconnected">
								<h2>
									<i class="material-icons connection_status">cast</i> 
									IHM joueurs
									<span class="refresh_room icon_button" title="Rafraichir l'affichage des joueurs" onClick="refreshRoom(${ this.id });"></span>
								</h2>
								<div class="compteurWrapper">
									${ this.compteur && this.compteur.render() }
								</div>
								<div class="boiteMessage">
									<div class="input-field col s12">
										<select class="selectSentences">
											${ this.renderVoicesSelect(IA_PARAMETERS.sentences) }
										</select>
									</div>
									
									<div class="input-field col s12 boiteMessage_input_wrapper">
									  <input id="room_textarea_${this.id}" class="materialize-input" disabled placeholder="Synthétiser un message" />
									  <select class="selectVoice">
									  	${ ALL_VOICES.map(voice => 
													`<option ${voice.name === "French Female" && "selected"} value="${voice.name}">${voice.name}</option>` 
												)}
									  </select>
									</div>
									
									<div class="actionButtons">
										<a class="waves-effect waves-light blue lighten-1 btn-small full_button" onClick="testMessage(${ this.id });"><i class="material-icons left">volume_up</i>Test</a>
										<a class="waves-effect waves-light blue darken-4 btn-small full_button" onClick="sendMessageToRoom(${ this.id });"><i class="material-icons left">send</i>Envoyer</a>                            
									</div>
								</div>
								<div class="boiteTaunt">
										<h3>Taunts</h3>
										<div class="input-field">
											<select class="selectTaunt" id="taunt_${ this.id }">
												${ this.renderTauntSelect() }
											</select>
										</div>
										
										<div class="actionButtons">
											<label class="tauntLastTime">Dernier taunt envoyé : <span></span></label>
											<a class="waves-effect waves-light blue darken-4 btn-small full_button" onClick="sendTauntToRoom(${ this.id });"><i class="material-icons left">send</i>Envoyer</a>                            
										</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
        `;
	}

	renderTauntSelect() {
		return IA_PARAMETERS.tauntTexts.map(taunt => `<option value="${ taunt.id }">${ taunt.text } (${ taunt.voice.name })</option>`).join("");
	}

	renderVoicesSelect() {
		return IA_PARAMETERS.sentences.map(sentence => `<option value="${ sentence.id }">${ sentence.text } (${ sentence.voice.name })</option>`).join("");
	}

	renderAndApply() {
		$("#room_" + this.id).replaceWith(this.render());
	}
}

class AddRoom {
	render() {
		return `
            <section id="addRoom" class="room" onClick="newRoom()">
                <div>Ajouter</div>
            </section>
        `;
	}
}

const preventBadCharacterForRoomName = (event) => {
	const inp = String.fromCharCode(event.keyCode);
	return /[a-zA-Z0-9]/.test(inp);
};
