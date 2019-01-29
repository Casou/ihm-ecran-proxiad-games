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
			<div class="col s12 m6">
				<div id="room_${this.id}" class="card blue-grey darken-3 room ${ this.data.terminateStatus }">
					<div class="card-content">
						<header>
							<span class="reinit_room" title="Réinitialiser la salle" onClick="reinitRoom(${ this.id });"></span>
							<div class="input-field">
							  <input type="text" 
									class="room_name" 
									value="${ this.data.name }"
									onChange="updateRoomName(${ this.id }, this.value)" />
							</div>
							<span class="delete_room" title="Supprimer la salle" onClick="deleteRoom(${ this.id });"></span>
						</header>
						<div>
							<div class="riddle_icons">
								${ this.riddles.map(riddle => {
									let resolved = this.data.resolvedRiddles.filter(r => r.riddleId === riddle.riddleId).length > 0;
									return `<span id="room_${this.data.id}_riddle_${riddle.id}" 
													title="${riddle.name}" 
													class="tooltip riddle riddle_${riddle.id} ${ resolved ? "resolved" : "unresolved" }">` + 
											`</span>`;
									}).join(" ") 
								}
							</div>
							<div class="riddlePc disconnected">
								<h2><span class="connection_status"></span> PC énigme</h2>
								<div class="terminal">
									$ >
								</div>
							</div>
							<div class="raspberry disconnected">
								<h2>
									<span class="connection_status"></span> 
									IHM joueurs
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
						
						<footer>
							<span class="refresh_room" title="Rafraichir l'affichage des joueurs" onClick="refreshRoom(${ this.id });"></span>
						</footer>
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

