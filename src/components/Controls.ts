class Controls {
    private playButton: HTMLButtonElement;
    private pauseButton: HTMLButtonElement;
    private stopButton: HTMLButtonElement;
    private nextButton: HTMLButtonElement;
    private prevButton: HTMLButtonElement;
    private audio: HTMLAudioElement;

    constructor(audioElement: HTMLAudioElement) {
        this.audio = audioElement;
        this.playButton = document.getElementById('playBtn') as HTMLButtonElement;
        this.pauseButton = document.getElementById('pauseBtn') as HTMLButtonElement;
        this.stopButton = document.getElementById('stopBtn') as HTMLButtonElement;
        this.nextButton = document.getElementById('nextBtn') as HTMLButtonElement;
        this.prevButton = document.getElementById('prevBtn') as HTMLButtonElement;

        this.addEventListeners();
    }

    private addEventListeners() {
        this.playButton.addEventListener('click', () => this.play());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.stopButton.addEventListener('click', () => this.stop());
        this.nextButton.addEventListener('click', () => this.nextTrack());
        this.prevButton.addEventListener('click', () => this.previousTrack());
    }

    public play() {
        this.audio.play();
    }

    public pause() {
        this.audio.pause();
    }

    public stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    public nextTrack() {
        // Logic to go to the next track
    }

    public previousTrack() {
        // Logic to go to the previous track
    }
    
}

export default Controls;