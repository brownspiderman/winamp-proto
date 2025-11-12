export class Playlist {
    private tracks: { title: string; artist: string; url: string }[];
    private currentTrackIndex: number;
    private playlistElement: HTMLElement;

    constructor(playlistElement: HTMLElement) {
        this.tracks = [];
        this.currentTrackIndex = 0;
        this.playlistElement = playlistElement;
    }

    public addTrack(title: string, artist: string, url: string): void {
        this.tracks.push({ title, artist, url });
        this.render();
    }

    public selectTrack(index: number): void {
        if (index >= 0 && index < this.tracks.length) {
            this.currentTrackIndex = index;
            this.render();
        }
    }

    public getCurrentTrack(): { title: string; artist: string; url: string } {
        return this.tracks[this.currentTrackIndex];
    }

    private render(): void {
        this.playlistElement.innerHTML = '';
        this.tracks.forEach((track, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'playlist-item';
            trackItem.textContent = `${track.title} - ${track.artist}`;
            trackItem.onclick = () => this.selectTrack(index);
            if (index === this.currentTrackIndex) {
                trackItem.classList.add('active');
            }
            this.playlistElement.appendChild(trackItem);
        });
    }
}