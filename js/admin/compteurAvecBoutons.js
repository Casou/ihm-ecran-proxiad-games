class CompteurAvecBoutons {

  constructor(selector, compteur, volume, id, isConnected = false, statusTime = "PAUSED") {
    this.selector = selector;
    this.compteur = compteur;
    this.id = id;
    this.isTerminated = false;
    this.isConnected = isConnected;
    this.forceText = statusTime === "INITIALIZING" ? this._getIntroPlayingText() : null;
    this.volume = volume;
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

  animateModifyTime(time, secondsToAdd = -1) {
    if (!this.compteur) {
      return Promise.reject(new Error('Counter is null'));
    }
    return this.compteur.animateModifyTime(time, secondsToAdd);
  }

  reinitTime() {
    this.compteur && this.compteur.stopTime();
    this.compteur = null;
    this.isTerminated = false;
    this.forceText = null;
    this.renderAndApply();
  }

  terminate(remainingTime) {
    this.compteur && this.compteur.pauseTime();
    this.compteur && (this.compteur.currentTime = remainingTime);
    this.isTerminated = true;
    this.renderAndApply();
  }

  playIntro() {
    this.forceText = this._getIntroPlayingText();
  }

  playIntroEnd() {
    this.forceText = null;
  }

  render() {
    const timerStarted = this.compteur && this.compteur.isStarted && !this.compteur.isPaused;
    const compteurRender = this.forceText || (this.compteur && this.compteur.render()) || "--:--:--";

    return `
			<button class="actionButton miniButton pauseButton ${!this.isConnected || this.isTerminated || !this.compteur || !timerStarted ? 'disabled' : ''}" onClick="stopTimer(${this.id})">❚❚</button> 
			<button class="actionButton miniButton startButton ${!this.isConnected || this.isTerminated || this.compteur && timerStarted ? 'disabled' : ''}" onClick="startTimer(${this.id})">▶</button>
			 
			<p class="compteur ${!this.isConnected ? 'disabled' : ''}">
				${compteurRender}
			</p>
			
			<div class="addTime tooltip ${!this.isConnected ? 'disabled' : ''}" title="Ajouter du temps">
			  <i class="material-icons addTimeIcon" onClick="openAddTimeDialog(${this.id})">access_time</i>
      </div>
			
			<div class="volume ${!this.isConnected ? 'disabled' : ''}">
			  <span class="tooltip" title="Volume de la musique de fond">Volume :</span> 
			  <input type="number" 
			        value="${ this.volume }"
			        min="0" max="1" step="0.05"
			         ${!this.isConnected ? 'disabled' : ''}
			        onChange="updateVolume(${ this.id }, this.value);" />
      </div>
      `;
  }

  renderAndApply() {
    $(this.selector).html(this.render());
    if (this.compteur) {
      this.compteur.renderAndApply();
    }
  }

  _getIntroPlayingText() {
    return "<i class='blink'>►</i>&nbsp;Intro&nbsp;";
  }

}
