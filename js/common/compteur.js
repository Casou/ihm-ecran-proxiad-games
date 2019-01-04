const INIT_TIME_IN_SECONDS = 60 * 60;

class Compteur {

    constructor(selector) {
        this.selector = selector;
        this.isStarted = false;
        this.currentTime = null;
        this.timerInterval = null;
    }

    initTimer() {
        this.currentTime = INIT_TIME_IN_SECONDS;
        this.render();
    }

    startTime() {
        if (this.isStarted) {
            return;
        }
        this.isStarted = true;
        this.timerInterval = setInterval(() => this.decreaseTime(), 1000);
    }

    pauseTime() {
        if (!this.isStarted) {
            return;
        }
        this.isStarted = false;
        clearInterval(this.timerInterval);
    }

    decreaseTime(secondsToDecrease =  1) {
        this.currentTime -= secondsToDecrease;
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
            .html(this.formatTime(this.currentTime))
            .attr('data-text', this.formatTime(this.currentTime))
            .toggleClass('alert', this.currentTime < 300) // 5 mn
        ;
    }

}
