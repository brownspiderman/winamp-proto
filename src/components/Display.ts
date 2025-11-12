export class Display {
    private trackDisplay: HTMLElement;
    private timeDisplay: HTMLElement;

    constructor(trackDisplayId: string, timeDisplayId: string) {
        this.trackDisplay = document.getElementById(trackDisplayId)!;
        this.timeDisplay = document.getElementById(timeDisplayId)!;
    }

    public updateTrackDisplay(trackTitle: string): void {
        this.trackDisplay.textContent = trackTitle;
    }

    public updateTimeDisplay(currentTime: number, duration: number): void {
        const formatTime = (time: number): string => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        this.timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }
    }
}