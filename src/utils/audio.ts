export class AudioPlayer {
    private audio: HTMLAudioElement;
    private currentTrackIndex: number;
    private playlist: Array<{ title: string; artist: string; url: string }>;
    private isPlaying: boolean;

    constructor(playlist: Array<{ title: string; artist: string; url: string }>) {
        this.audio = new Audio();
        this.playlist = playlist;
        this.currentTrackIndex = 0;
        this.isPlaying = false;
    }

    loadTrack(index: number) {
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        this.audio.src = track.url;
        this.audio.load();
    }

    play() {
        if (!this.isPlaying) {
            this.audio.play();
            this.isPlaying = true;
        }
    }

    pause() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        }
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
    }

    next() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        this.play();
    }

    previous() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        this.play();
    }

    getCurrentTrack() {
        return this.playlist[this.currentTrackIndex];
    }

    get isPlayingState() {
        return this.isPlaying;
    }

    setVolume(volume: number) {
        this.audio.volume = volume;
    }

    get duration() {
        return this.audio.duration;
    }

    get currentTime() {
        return this.audio.currentTime;
    }

    seek(time: number) {
        this.audio.currentTime = time;
    }
}