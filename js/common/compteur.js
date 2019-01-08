const INIT_TIME_IN_SECONDS = 60 * 60;

const calculateRemainingTime = (startTimeDate) => {
    const passedTimeInSeconds = Math.round((new Date().getTime() - startTimeDate.getTime()) / 1000);
    return Math.max(0, INIT_TIME_IN_SECONDS - passedTimeInSeconds);
};

class Compteur {

    constructor(selector, startTime, statusTime, remainingTime) {
        this.selector = selector;
        this.isStarted = false;
        this.isPaused = false;
        this.currentTime = null;
        this.timerInterval = null;

        if (startTime) {
            if (statusTime === "STARTED") {
				const calculatedRemainingTime = calculateRemainingTime(parseJavaLocalDateTimeToJsDate(startTime));
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

    startTime() {
        if (this.isStarted && !this.isPaused) {
            return;
        }
        this.isStarted = true;
        this.isPaused = false;
        this.timerInterval = setInterval(() => this._decreaseTime(), 1000);
    }

    pauseTime() {
        if (!this.isStarted) {
            return;
        }
        this.isPaused = true;
        clearInterval(this.timerInterval);
    }

    stopTime() {
        this.isStarted = false;
        this.isPaused = false;
		this.currentTime = null;
        this.timerInterval && clearInterval(this.timerInterval);
    }

    _decreaseTime(secondsToDecrease =  1) {
        this.currentTime -= secondsToDecrease;
        if (this.currentTime <= 0) {
            this.currentTime = 0;
            this.pauseTime();
        }
        this.renderAndApply();
    }

    _formatTime(time) {
        if (!time) {
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
