class Timer {
    constructor(seconds) {
        this._default = seconds;
        this._seconds = seconds;
        this._intervalId = null;
    }


    get seconds() {
        return this._seconds;
    }


    reset() {
        if (this._intervalId) {
            this._seconds = this._default;
            clearInterval(this._intervalId);
        }
    }


    play() {
        let t = this;
        this._intervalId = setInterval(function() {
            if (t._seconds > 0) {
                t._seconds = t._seconds - 1;
            }
        }, 1000);
    }


    toString() {
        let min = Math.floor(this._seconds / 60);
        let sec = this._seconds % 60;
        if (sec < 10)
            sec = "0" + sec;

        return min + ":" + sec;
    }
}