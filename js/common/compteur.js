const INIT_TIME_IN_SECONDS = 3600;

const calculateRemainingTime = (startTimeDate, remainingTime) => {
	const passedTimeInSeconds = Math.round((new Date().getTime() - startTimeDate.getTime()) / 1000);
	return Math.max(0, remainingTime - passedTimeInSeconds);
};

class Compteur {

	constructor(selector, startTime, statusTime, remainingTime) {
		this.selector = selector;
		this.isStarted = false;
		this.isPaused = false;
		this.initialTime = remainingTime;
		this.currentTime = null;
		this.timerInterval = null;
		this.onEndCount = null;
		this.startedTime = startTime;
		this.onRender = null;
		this.onStart = null;
		this.onStop = null;
		this.onPause = null;
		this.animated = false;

		if (startTime) {
			if (statusTime === "STARTED") {
				const calculatedRemainingTime = calculateRemainingTime(new Date(startTime), remainingTime);
				this.initTimer(calculatedRemainingTime);
				this.startTime();
			} else if (statusTime === "PAUSED") {
				this.isStarted = true;
				this.initTimer(remainingTime);
				this.pauseTime();
			}
			this.renderAndApply();
		}
	}

	initTimer(remainingTime = INIT_TIME_IN_SECONDS, initialTime = null, startTimeDate = null) {
		this.currentTime = remainingTime;
		if (initialTime) {
			this.initialTime = initialTime;
		}
		if (startTimeDate) {
			this.startedTime = startTimeDate;
		}
		this.renderAndApply();
	}

	startTime() {
		if (this.isStarted && !this.isPaused) {
			return;
		}
		this.isStarted = true;
		this.isPaused = false;
		this.renderAndApply();
		setTimeout(() => {
			this.timerInterval = setInterval(() => this._modifyTime(), 1000);
			if (!this.startedTime) {
				this.startedTime = new Date();
			}
			if (this.onStart) {
				this.onStart(this.currentTime, this.initialTime);
			}
		}, 1000);
	}

	pauseTime() {
		if (!this.isStarted) {
			return;
		}
		this.isPaused = true;
		clearInterval(this.timerInterval);
		if (this.onPause) {
			this.onPause(this.currentTime);
		}
	}

	stopTime() {
		this.isStarted = false;
		this.isPaused = false;
		this.currentTime = null;
		this.timerInterval && clearInterval(this.timerInterval);
		if (this.onStop) {
			this.onStop(this.currentTime);
		}
	}

	animateModifyTime(timeToReduce, coeff = -1) {
		return new Promise(resolve => {
			this.animated = true;
			const wasStarted = this.isStarted;
			this.pauseTime();

			let modifyCount = 0;
			const reduceInterval = setInterval(() => {
				this._modifyTime(coeff);
				this.renderAndApply();
				modifyCount++;

				if (modifyCount >= timeToReduce) {
					clearInterval(reduceInterval);
					if (wasStarted) {
						this.startTime();
					}
					this.animated = false;
					this.initialTime += (timeToReduce * coeff);
					resolve();
				}
			}, 5000 / timeToReduce);
		});
	}

	_modifyTime(secondsToAdd = -1, bypassRecalculateTime = false) {
		this.currentTime += secondsToAdd;
		if (this.currentTime <= 0) {
			this.currentTime = 0;
			this.pauseTime();

			// Render avant le end count pour éviter de rester à 00:00:01 en cas d'exception
			this.renderAndApply();
			if (this.onEndCount) {
				this.onEndCount();
			}
		} else if (this.currentTime % 10 === 0 && !bypassRecalculateTime) {
			this._recalculateTime();
		}
		this.renderAndApply();
	}

	_recalculateTime() {
		if (this.animated) {
			return;
		}
		const timePassed = Math.max(0, Math.round((new Date() - this.startedTime) / 1000));
		if (!isNaN(timePassed) && this.currentTime !== (this.initialTime - timePassed)) {
			const diff = this.currentTime - (this.initialTime - timePassed);
			if (diff < 0) {
				this.currentTime = this.currentTime - diff;
			} else {
				for (let i = 0; i < diff; i++) {
					setTimeout(() => this._modifyTime(-1, true), 100);
				}
			}
		}
	}

	_formatTime(time) {
		if (!time && time !== 0) {
			return "--:--:--";
		}

		let totalSeconds = time;
		const hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		return lpad(hours) + ":" + lpad(minutes) + ":" + lpad(seconds);
	}

	render() {
		if (this.onRender) {
			this.onRender(this.currentTime);
		}

		const cssClasses = [];
		this.isStarted && cssClasses.push("started");
		this.isPaused && cssClasses.push("paused");

		const text = !this.isStarted ? "--:--:--" : this._formatTime(this.currentTime);

		return `<span class="${ cssClasses.join(" ") }">${ text }</span>`;
	}

	renderAndApply() {
		$(this.selector)
			.html(this.render())
			.attr('data-text', this._formatTime(this.currentTime))
			.toggleClass('alert', this.currentTime && this.currentTime < 300) // 5 mn
			.toggleClass('finished', this.currentTime && this.currentTime === 0)
		;
	}

}
