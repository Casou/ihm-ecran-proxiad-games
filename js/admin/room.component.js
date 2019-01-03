class Room {

    constructor(data, riddles) {
        this.id = data.id;
        this.data = data;
        this.riddles = riddles;
    }

    render() {
        return `
            <section id="room_${this.id}">
                <header>
                    <input type="text" value="${ this.data.name }" onChange="updateRoomName(${ this.id }, this.value)"/> 
                    <span class="delete_room" title="Supprimer la salle" onClick="deleteRoom(${ this.id });"></span>
                </header>
                <div>
                    <nav>
                        ${ this.riddles.map(riddle => {
                            let resolved = this.data.resolvedRiddleIds.filter(id => id === riddle.riddleId).length > 0;
                            return `<span id="room_${this.data.id}_riddle_${riddle.id}" 
                                            title="${riddle.name}" 
                                            class="tooltip riddle_${riddle.id} ${ resolved ? "resolved" : "unresolved" }">` + 
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
                            <span class="connection_status"></span> IHM joueurs
                        </h2>
                        <p class="compteur">
                            <span>00:00:00</span>
                            <button class="actionButton miniButton">Démarrer</button>
                        </p>
                        <div class="boiteMessage">
                            <textarea placeholder="Synthétiser un message" disabled></textarea>
                            <button class="actionButton">Envoyer</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

class AddRoom {
    render() {
        return `
            <section id="addRoom" onClick="newRoom()">
                <div>Ajouter</div>
            </section>
        `;
    }
}

