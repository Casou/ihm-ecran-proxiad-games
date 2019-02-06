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
        this.currentTime = null;
        this.timerInterval = null;
        this.onEndCount = null;
        this.startedTime = startTime;
        this.onRender = null;
        this.onStop = null;
		this.onPause = null;

        if (startTime) {
            if (statusTime === "STARTED") {
				const calculatedRemainingTime = calculateRemainingTime(parseJavaLocalDateTimeToJsDate(startTime), remainingTime);
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

    initTimer(remainingTime = INIT_TIME_IN_SECONDS) {
		this.currentTime = remainingTime;
        this.renderAndApply();
    }

	refreshRemainingTime() {
		const calculatedRemainingTime = calculateRemainingTime(parseJavaLocalDateTimeToJsDate(this.startedTime), this.currentTime);
		this.initTimer(calculatedRemainingTime);
	}

    startTime() {
        if (this.isStarted && !this.isPaused) {
            return;
        }
        this.isStarted = true;
        this.isPaused = false;
        this.renderAndApply();
        setTimeout(() => {
			this.timerInterval = setInterval(() => this._decreaseTime(), 1000);
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

    animateReduceTime(time) {
    	return new Promise(resolve => {
			const wasStarted = this.isStarted;
			this.pauseTime();

			let decreasedCount = 0;
			const reduceInterval = setInterval(() => {
				this._decreaseTime(1);
				this.renderAndApply();
				decreasedCount++;

				if (decreasedCount >= time) {
					clearInterval(reduceInterval);
					if (wasStarted) {
						this.startTime();
					}
					resolve();
				}
			}, 5000 / time);
		});
    }

    _decreaseTime(secondsToDecrease =  1) {
        this.currentTime -= secondsToDecrease;
        if (this.currentTime <= 0) {
            this.currentTime = 0;
            this.pauseTime();

            if (this.onEndCount) {
				this.onEndCount();
			}
        }
        this.renderAndApply();
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
        return `<span>${ !this.isStarted ? "--:--:--" : this._formatTime(this.currentTime) }</span>`;
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
