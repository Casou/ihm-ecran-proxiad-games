class CompteurAvecBoutons {

    constructor(selector, compteur, id, isConnected = false) {
        this.selector = selector;
        this.compteur = compteur;
        this.id = id;
        this.isTerminated = false;
		this.isConnected = isConnected;
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

	animateReduceTime(time) {
    	if (!this.compteur) {
    		return Promise.reject(new Error('Counter is null'));
		}
		return this.compteur.animateReduceTime(time);
	}

	reinitTime() {
		this.compteur && this.compteur.stopTime();
		this.compteur = null;
		this.isTerminated = false;
		this.renderAndApply();
	}

	terminate() {
		this.compteur && this.compteur.pauseTime();
		this.isTerminated = true;
		this.renderAndApply();
	}

    render() {
		const timerStarted = this.compteur && this.compteur.isStarted && !this.compteur.isPaused;

        return `
			<button class="actionButton miniButton pauseButton ${ !this.isConnected || this.isTerminated || !this.compteur || !timerStarted ? 'disabled' : '' }" onClick="stopTimer(${this.id})">❚❚</button> 
			<button class="actionButton miniButton startButton ${ !this.isConnected || this.isTerminated || this.compteur && timerStarted ? 'disabled' : '' }" onClick="startTimer(${this.id})">▶</button>
			 
			<p class="compteur ${ !this.isConnected ? 'disabled' : '' }">
				${ (this.compteur && this.compteur.render()) || "--:--:--" }
			</p>
        `;
    }

    renderAndApply() {
        $(this.selector).html(this.render());
		if (this.compteur) {
			this.compteur.renderAndApply();
		}
    }

}
