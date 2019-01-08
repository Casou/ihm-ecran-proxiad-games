class CompteurAvecBoutons {

    constructor(selector, compteur, id) {
        this.selector = selector;
        this.compteur = compteur;
        this.id = id;
        if (!id) debugger;
    }

	initTimer(remainingTime) {
		this.compteur && this.compteur.initTimer(remainingTime);
	}

	startTime() {
		this.compteur && this.compteur.startTime();
	}

	pauseTime() {
		this.compteur && this.compteur.pauseTime();
	}

	stopTime() {
		this.compteur && this.compteur.stopTime();
	}

	reinitTime() {
		this.compteur && this.compteur.stopTime();
		this.compteur = null;
		this.renderAndApply();
	}

    render() {
		const timerStarted = this.compteur && this.compteur.isStarted && !this.compteur.isPaused;

        return `
			<!-- <button class="actionButton miniButton resetButton ${ !this.compteur || timerStarted ? 'disabled' : '' }" onClick="resetTimer(${this.id})">↻</button> --> 
			<!-- <button class="actionButton miniButton stopButton ${ !this.compteur || !timerStarted ? 'disabled' : '' }" onClick="stopTimer(${this.id})">■</button> --> 
			<button class="actionButton miniButton pauseButton ${ !this.compteur || !timerStarted ? 'disabled' : '' }" onClick="stopTimer(${this.id})">❚❚</button> 
			<button class="actionButton miniButton startButton ${ this.compteur && timerStarted ? 'disabled' : '' }" onClick="startTimer(${this.id})">▶</button>
			 
			<p class="compteur">
				${ (this.compteur && this.compteur.render()) || "-" }
			</p>
        `;
    }

    renderAndApply() {
        $(this.selector).html(this.render());
		this.compteur && this.compteur.renderAndApply();
    }

}
