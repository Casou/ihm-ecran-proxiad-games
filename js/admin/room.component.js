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
            <section id="room_${this.id}" class="room ${ this.data.terminateStatus }">
                <header>
                    <span class="reinit_room" title="Réinitialiser la salle" onClick="reinitRoom(${ this.id });"></span>
                    <input class="room_name" type="text" value="${ this.data.name }" onChange="updateRoomName(${ this.id }, this.value)"/> 
                    <span class="delete_room" title="Supprimer la salle" onClick="deleteRoom(${ this.id });"></span>
                </header>
                <div>
                    <nav>
                        ${ this.riddles.map(riddle => {
                            let resolved = this.data.resolvedRiddles.filter(r => r.riddleId === riddle.riddleId).length > 0;
                            return `<span id="room_${this.data.id}_riddle_${riddle.id}" 
                                            title="${riddle.name}" 
                                            class="tooltip riddle riddle_${riddle.id} ${ resolved ? "resolved" : "unresolved" }">` + 
                                    `</span>`;
                            }).join(" ") 
                        }
                    </nav>
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
                            <textarea placeholder="Synthétiser un message" disabled></textarea>
                            
                            <div class="actionButtons">
                                <button class="actionButton" onClick="testMessage(${this.id});">Test</button>
                                <button class="actionButton" onClick="sendMessageToRoom(${this.id});">Envoyer</button>                            
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
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

