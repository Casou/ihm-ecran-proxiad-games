class Room {

    constructor(data, riddles) {
        this.id = data.id;
        this.data = data;
        this.riddles = riddles;

        const compteurSeul = (data.startTime && new Compteur('#room_' + this.id + " .raspberry .compteur", data.startTime, data.statusTime, data.remainingTime)) || null;
        this.compteur = new CompteurAvecBoutons('#room_' + this.id + " .raspberry .compteurWrapper", compteurSeul, this.id);
    }

    render() {
        return `
			<div id="room_${this.id}" class="col s12 m6">
				<div class="card blue-grey darken-3 room ${ this.data.terminateStatus }">
					<div class="card-content">
						<header>
							<span class="reinit_room" title="Réinitialiser la salle" onClick="reinitRoom(${ this.id });"></span>
							<div class="input-field">
							  <input type="text" 
									class="room_name" 
									value="${ this.data.name }"
									onKeyPress="return preventBadCharacterForRoomName(event)"
									onChange="updateRoomName(${ this.id }, this.value)" />
							</div>
							<span class="delete_room" title="Supprimer la salle" onClick="deleteRoom(${ this.id });"></span>
						</header>
						<div>
							<div class="riddle_icons">
								${ this.riddles.map(riddle => {
									let resolved = this.data.resolvedRiddles.filter(r => r.riddleId === riddle.riddleId).length > 0;
									return `<i id="room_${this.data.id}_riddle_${riddle.id}" 
													title="${riddle.name}" 
													class="tooltip riddle material-icons riddle_${riddle.id} ${ resolved ? "resolved" : "unresolved" }">
												${ resolved ? "lock_open" : "lock_outline" }
											</i>`;
									}).join(" ") 
								}
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
									<span class="refresh_room" title="Rafraichir l'affichage des joueurs" onClick="refreshRoom(${ this.id });"></span>
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
									
									<div class="input-field col s12">
									  <textarea id="room_textarea_${this.id}" class="materialize-textarea" disabled placeholder="Synthétiser un message"></textarea>
									</div>
									
									
									<div class="actionButtons">
										<a class="waves-effect waves-light blue lighten-1 btn-small" onClick="testMessage(${ this.id });"><i class="material-icons left">volume_up</i>Test</a>
										<a class="waves-effect waves-light blue darken-4 btn-small" onClick="sendMessageToRoom(${ this.id });"><i class="material-icons left">send</i>Envoyer</a>                            
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
        `;
    }

    renderVoicesSelect(sentences) {
        return sentences.map(sentence => `<option value="${ sentence.id }">${ sentence.text } (${ sentence.voice })</option>`).join("");
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
