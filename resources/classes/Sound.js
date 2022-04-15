/*******************************************************************/
/* Sounds */
class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.isPlaying = false;

        document.body.appendChild(this.sound);
    }

    play = function (loop) {
        this.sound.currentTime = 0;
        if (loop) this.sound.setAttribute("loop", "true");

        this.sound.play();
        this.isPlaying = true;
    }

    stop = function () {
        this.sound.pause();
        this.isPlaying = false;
    }

}