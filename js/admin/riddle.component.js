class Riddle {
    constructor(data) {
        this.id = data.id;
        this.data = data;
    }

    render() {
        return `
        <div id="riddle_${this.id}" class="riddle">
            <header>
                <input id="name_riddle_${this.id}" value="${ this.data.name }" onChange="updateRiddleName(${this.id}, this.value);" />
            </header>
            <div>
                <ul>
                    <li>
                        <label for="id_riddle_${this.id}">Id : </label>
                        <input id="id_riddle_${this.id}" value="${ this.data.riddleId }" onChange="updateRiddleId(${ this.id }, this.value)" />
                    </li>
                    <li>
                        <label for="pwd_riddle_${this.id}">Pwd : </label>
                        <input id="pwd_riddle_${this.id}" value="${ this.data.riddlePassword }" onChange="updateRiddlePassword(${ this.id }, this.value)" />
                    </li>
                </ul>
                <button class="deleteButton miniButton" onClick="deleteRiddle(${ this.id });">Supprimer</button>
            </div>
        </div>
        `;
    }
}

class AddRiddle {
    render() {
        return `
            <div id="addRiddle" class="riddle">
                <div onClick="newRiddle();">Ajouter une énigme</div>
            </div>
        `;
    }
}
