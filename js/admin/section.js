class Section {

    constructor(data) {
        this.id = data.token;
        $("main").append(`<section id="${this.id}"></section>`);

        this.data = data;

        this.render();
    }

    render() {
        $("main #" + this.id).html(`
        <header>
            Salle ${ this.userName } 
            <span>X</span>
        </header>
        <div>
            <nav>
                [o] [ ] [ ]
            </nav>
            <div class="terminal">
                $ >
            </div>
            <div class="boiteMessage">
                <textarea>
                
                </textarea>
                <button>Envoyer</button>
            </div>
        </div>
        `);
    }
}
