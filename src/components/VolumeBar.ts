class VolumeBar {
    private volumeSlider: HTMLElement;
    private volumeThumb: HTMLElement;
    private audioElement: HTMLAudioElement;

    constructor(audioElement: HTMLAudioElement) {
        this.audioElement = audioElement;
        this.volumeSlider = document.getElementById('volumeSlider')!;
        this.volumeThumb = document.getElementById('volumeThumb')!;
        this.init();
    }

    private init() {
        this.volumeSlider.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.updateVolumeThumb();
    }

    private onMouseDown(event: MouseEvent) {
        const sliderRect = this.volumeSlider.getBoundingClientRect();
        const maxLeft = sliderRect.width - this.volumeThumb.clientWidth;

        const onMouseMove = (e: MouseEvent) => {
            let left = Math.max(0, Math.min(e.clientX - sliderRect.left, maxLeft));
            const volume = Math.round((left / maxLeft) * 100);
            this.audioElement.volume = volume / 100;
            this.updateVolumeThumb(left);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    private updateVolumeThumb(left: number = 0) {
        this.volumeThumb.style.left = `${left}px`;
    }
}

export default VolumeBar;