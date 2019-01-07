class Room {

    constructor(data, riddles) {
        this.id = data.id;
        this.data = data;
        this.riddles = riddles;
        this.compteur = (data.startTime && new Compteur('#room_' + this.id + " .raspberry .compteur", data.startTime, data.statusTime, data.remainingTime)) || null;
    }

    render() {
        const timerStarted = this.compteur && this.compteur.isStarted && !this.compteur.isPaused;

        return `
            <section id="room_${this.id}">
                <header>
                    <input type="text" value="${ this.data.name }" onChange="updateRoomName(${ this.id }, this.value)"/> 
                    <span class="delete_room" title="Supprimer la salle" onClick="deleteRoom(${ this.id });"></span>
                </header>
                <div>
                    <nav>
                        ${ this.riddles.map(riddle => {
                            let resolved = this.data.resolvedRiddles.filter(r => r.riddleId === riddle.riddleId).length > 0;
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
                            <span class="connection_status"></span> 
                            IHM joueurs
                            
                            <button class="actionButton miniButton pauseButton ${ !timerStarted && 'hidden' }" onClick="stopTimer(${this.id})">Arrêter</button> 
                            <button class="actionButton miniButton startButton ${ timerStarted && 'hidden' }" onClick="startTimer(${this.id})">Démarrer</button> 
                        </h2>
                        <p class="compteur">
                            ${ (this.compteur && this.compteur.render()) || "-" }
                        </p>
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

