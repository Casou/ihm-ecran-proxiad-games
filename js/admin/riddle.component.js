class Riddle {
    constructor(data) {
        this.id = data.id;
        this.data = data;
    }

    render() {
        return `
        <div id="riddle_${this.id}" class="card blue-grey darken-3 riddle">
            <header class="input-field">
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
                <a class="waves-effect waves-light red lighten-2 btn-small" onClick="deleteRiddle(${ this.id });"><i class="material-icons left">delete</i>Supprimer</a>
            </div>
        </div>
        `;
    }
}

class AddRiddle {
    render() {
        return `
            <div id="addRiddle" class="riddle valign-wrapper">
                <div onClick="newRiddle();">Ajouter une énigme</div>
            </div>
        `;
    }
}
