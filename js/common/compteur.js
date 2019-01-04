const INIT_TIME_IN_SECONDS = 60 * 60;

const calculateRemainingTime = (startTimeDate) => {
    const passedTimeInSeconds = Math.round((new Date().getTime() - startTimeDate.getTime()) / 1000);
    return Math.max(0, INIT_TIME_IN_SECONDS - passedTimeInSeconds);
};

class Compteur {

    constructor(selector, startTime) {
        this.selector = selector;
        this.isStarted = false;
        this.isPaused = false;
        this.currentTime = null;
        this.timerInterval = null;

        if (startTime) {
            const remainingTime = calculateRemainingTime(parseJavaLocalDateTimeToJsDate(startTime));

            this.initTimer(remainingTime);
            this.startTime();
            this.render();
        }
    }

    initTimer(remainingTime = INIT_TIME_IN_SECONDS) {
        this.currentTime = remainingTime;
        this.render();
    }

    startTime() {
        if (this.isStarted && !this.isPaused) {
            return;
        }
        this.isStarted = true;
        this.isPaused = false;
        this.timerInterval = setInterval(() => this.decreaseTime(), 1000);
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
        this.timerInterval && clearInterval(this.timerInterval);
    }

    decreaseTime(secondsToDecrease =  1) {
        this.currentTime -= secondsToDecrease;
        if (this.currentTime <= 0) {
            this.currentTime = 0;
            this.pauseTime();
        }
        this.render();
    }

    formatTime(time) {
        let totalSeconds = time;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return lpad(hours) + ":" + lpad(minutes) + ":" + lpad(seconds);
    }

    render() {
        $(this.selector)
            .html(!this.isStarted ? "-" : this.formatTime(this.currentTime))
            .attr('data-text', this.formatTime(this.currentTime))
            .toggleClass('alert', this.currentTime < 300) // 5 mn
            .toggleClass('finished', this.currentTime === 0)
        ;
    }

}
