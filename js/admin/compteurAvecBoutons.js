class CompteurAvecBoutons {

    constructor(selector, compteur, id) {
        this.selector = selector;
        this.compteur = compteur;
        this.id = id;
        this.isTerminated = false;
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

	setCurrentTime(time) {
    	this.compteur && (this.compteur.currentTime = time);
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
			<!-- <button class="actionButton miniButton resetButton ${ this.isTerminated || !this.compteur || timerStarted ? 'disabled' : '' }" onClick="resetTimer(${this.id})">↻</button> --> 
			<!-- <button class="actionButton miniButton stopButton ${ this.isTerminated || !this.compteur || !timerStarted ? 'disabled' : '' }" onClick="stopTimer(${this.id})">■</button> --> 
			<button class="actionButton miniButton pauseButton ${ this.isTerminated || !this.compteur || !timerStarted ? 'disabled' : '' }" onClick="stopTimer(${this.id})">❚❚</button> 
			<button class="actionButton miniButton startButton ${ this.isTerminated || this.compteur && timerStarted ? 'disabled' : '' }" onClick="startTimer(${this.id})">▶</button>
			 
			<p class="compteur">
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
