interface Track {
    title: string;
    artist: string;
    url: string;
}

interface Elements {
    winamp: HTMLElement;
    playButton: HTMLElement;
    pauseButton: HTMLElement;
    stopButton: HTMLElement;
    prevButton: HTMLElement;
    nextButton: HTMLElement;
    titlebar: HTMLElement;
    songTitle: HTMLElement;
    timeDisplay: HTMLElement;
    volumeSlider: HTMLElement;
    progressBar: HTMLElement;
    playlistContainer: HTMLElement;
    equalizerContainer: HTMLElement;
}

export class WinampPlayer {
    private audio: HTMLAudioElement;
    private isPlaying: boolean;
    private currentTrackIndex: number;
    private isShuffle: boolean;
    private isRepeat: boolean;
    private volume: number;
    private elements: Elements = {} as Elements;
    private playlist: Track[];

    private readonly S3_BUCKET = "https://m1xtape-man-music.s3.ap-south-1.amazonaws.com";
    private readonly BASE_PATH = "Beats%20in%20Drive";

    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrackIndex = 0;
        this.isShuffle = false;
        this.isRepeat = false;
        this.volume = 70;
        this.playlist = this.initializePlaylist();
        
        this.initializePlayer();
        this.setupEventListeners();
    }

    private initializePlaylist(): Track[] {
        return [
            { title: "Analog", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Analog.wav` },
            { title: "Analog", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Analog.wav` },
            { title: "Alarms", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Alarms.wav` },
            { title: "Ark", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Ark.wav` },
            { title: "Aux", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Aux.aif` },
            { title: "B-roll", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/B-roll.wav` },
            { title: "Back in the day", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Back%20in%20the%20day.wav` },
            { title: "Badass", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Badass.wav` },
            { title: "Bangalore", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Bangalore.aif` },
            { title: "Breaking", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Breaking.wav` },
            { title: "Cool", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Cool.wav` },
            { title: "Cover", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Cover.aif` },
            { title: "Dead Man", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Dead%20Man.wav` },
            { title: "December", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/December%20(Instrumental).wav` },
            { title: "Dill Cosmic", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Dill%20Cosmic.wav` },
            { title: "Digital", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Digital.wav` },
            { title: "Down bad", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Down%20bad%20_%20rock%20bottom.wav` },
            { title: "Dreamer - side A", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Dreamer%20-%20side%20A.wav` },
            { title: "Fast Life", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Fast%20Life.aif` },
            { title: "Fishes", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Fishes.wav` },
            { title: "Fuck it", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Fuck%20it..wav` },
            { title: "Get Her", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Get%20Her.wav` },
            { title: "Gold Rush", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Gold%20Rush.wav` },
            { title: "Hip", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Hip.aif` },
            { title: "Invaderrzzz", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Invaderrzzz.wav` },
            { title: "Jimi", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Jimi.wav` },
            { title: "Let go", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Let%20go.wav` },
            { title: "Lines", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Lines.wav` },
            { title: "Love", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Love.aif` },
            { title: "Magik", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Magik.wav` },
            { title: "Pack Up", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Pack%20Up.aif` },
            { title: "Pocket", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Pocket.wav` },
            { title: "Portal", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Portal.wav` },
            { title: "Race", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Race.aif` },
            { title: "Randomly Flip", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Randomly%20Flip.aif` },
            { title: "Retro", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Retro.aif` },
            { title: "Silent killer", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Silent%20killer.mp3` },
            { title: "Slugfest", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Slugfest.wav` },
            { title: "South", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/South.aif` },
            { title: "Swordfish", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Swordfish.wav` },
            { title: "To the cutey", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/To%20the%20cutey%20who%20won't%20reply.wav` },
            { title: "Tragically Hip", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Tragically%20Hip.wav` },
            { title: "Valley", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Valley.wav` },
            { title: "Wav", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Wav.wav` },
            { title: "What is this feeling", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/What%20is%20this%20feeling%3F.wav` },
            { title: "White lies", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/White%20lies.wav` },
            { title: "Why I Stayed", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Why%20I%20Stayed.wav` },
            { title: "Wicked game", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%201/Wicked%20game%20-%20side%20B.wav` },
            { title: "Braking", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%202/03%20Braking.wav` },
            { title: "Pack Up", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%202/01%20Pack%20Up.wav` },
            { title: "Fast Life - Now", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%202/02%20Fast%20Life%20-%20Now.wav` },
            { title: "City Evening", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%202/04%20City%20(Evening).wav` },
            { title: "Rooftop Vibes", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%202/05%20Rooftop%20Vibes.wav` },
            { title: "Pushin", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%202/06%20Pushin'.wav` },
            { title: "BNB", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/BNB.wav` },
            { title: "Dirt Red", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/Dirt_Red.wav` },
            { title: "Fire", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/Fire.wav` },
            { title: "Funky Joint", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/Funky_Joint.wav` },
            { title: "I LUH U", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/I_LUH_U.wav` },
            { title: "Industrial", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/Industrial_Type_shi.wav` },
            { title: "Insane Beat", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/Insane_Sounding_Beat_.wav` },
            { title: "Manga Journey", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/manga_journey.wav` },
            { title: "Smoke break", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/Smoke_break.wav` },
            { title: "Sufjan Flip", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/Sufjan_Flip_.wav` },
            { title: "The Clapper", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/The_Clapper.wav` },
            { title: "Trees", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/Trees.wav` },
            { title: "Untitled", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/Untitled.wav` },
            { title: "Untitled 2", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/Untitled%20(1).wav` },
            { title: "Young Fine", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%203/Young__Fine_Flip.wav` },
            { title: "Acid", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Acid.wav` },
            { title: "Angst", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Angst.wav` },
            { title: "Arghh", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Arghh.wav` },
            { title: "Barstool", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Barstool.wav` },
            { title: "BunderThat", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/BunderThat.wav` },
            { title: "Call", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Call.wav` },
            { title: "Chal", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Chal.wav` },
            { title: "Chillwavin", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Chillwavin.wav` },
            { title: "Forest", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Forest.wav` },
            { title: "Good Nite", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Good%20Nite.wav` },
            { title: "Happy", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Happy.wav` },
            { title: "Hearts", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Hearts.wav` },
            { title: "Hillchawin", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Hillchawin.wav` },
            { title: "Internetizen", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Internetizen.wav` },
            { title: "Love Her", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Love%20Her.wav` },
            { title: "Moving Now", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Moving%20Now.wav` },
            { title: "Progress", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Progress.wav` },
            { title: "Reminisce", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Reminisce.wav` },
            { title: "Skip Anxiety", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Skip%20Anxiety.wav` },
            { title: "Something Something", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Something%20Something.wav` },
            { title: "Suave", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Suave.wav` },
            { title: "Wandering", artist: "m1xtapeman", url: `${this.S3_BUCKET}/${this.BASE_PATH}/BID%20Pt.%204/Wandering.wav` }
        ];
    }

    private initializePlayer(): void {
        this.elements = {
            winamp: document.getElementById('winamp') as HTMLElement,
            playButton: document.querySelector('.play') as HTMLElement,
            pauseButton: document.querySelector('.pause') as HTMLElement,
            stopButton: document.querySelector('.stop') as HTMLElement,
            prevButton: document.querySelector('.previous') as HTMLElement,
            nextButton: document.querySelector('.next') as HTMLElement,
            titlebar: document.querySelector('.titlebar') as HTMLElement,
            songTitle: document.querySelector('.song-title') as HTMLElement,
            timeDisplay: document.querySelector('.time-display') as HTMLElement,
            volumeSlider: document.querySelector('.volume-slider') as HTMLElement,
            progressBar: document.querySelector('.progress-bar') as HTMLElement,
            playlistContainer: document.querySelector('.playlist-container') as HTMLElement,
            equalizerContainer: document.querySelector('.equalizer-container') as HTMLElement
        };

        this.audio.volume = this.volume / 100;
        this.makeDraggable(this.elements.titlebar, this.elements.winamp);
    }

    private makeDraggable(handle: HTMLElement, element: HTMLElement): void {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const dragMouseDown = (e: MouseEvent) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        const elementDrag = (e: MouseEvent) => {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = `${element.offsetTop - pos2}px`;
            element.style.left = `${element.offsetLeft - pos1}px`;
        };

        const closeDragElement = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        };

        handle.onmousedown = dragMouseDown;
    }

    private setupEventListeners(): void {
        this.elements.playButton.addEventListener('click', () => this.play());
        this.elements.pauseButton.addEventListener('click', () => this.pause());
        this.elements.stopButton.addEventListener('click', () => this.stop());
        this.elements.prevButton.addEventListener('click', () => this.previousTrack());
        this.elements.nextButton.addEventListener('click', () => this.nextTrack());
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onTrackEnd());
    }

    private play(): void {
        if (!this.audio.src) {
            this.loadTrack(this.currentTrackIndex);
        }
        this.audio.play();
        this.isPlaying = true;
        this.updatePlaybackState();
    }

    private pause(): void {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlaybackState();
    }

    private stop(): void {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.updatePlaybackState();
    }

    private previousTrack(): void {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
    }

    private nextTrack(): void {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
    }

    private loadTrack(index: number): void {
        const track = this.playlist[index];
        this.audio.src = track.url;
        this.elements.songTitle.textContent = `${track.title} - ${track.artist}`;
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    private updatePlaybackState(): void {
        this.elements.playButton.style.display = this.isPlaying ? 'none' : 'block';
        this.elements.pauseButton.style.display = this.isPlaying ? 'block' : 'none';
    }

    private updateProgress(): void {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        const progressBar = this.elements.progressBar.querySelector('.progress-fill') as HTMLElement;
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        this.updateTimeDisplay();
    }

    private updateTimeDisplay(): void {
        const current = this.formatTime(this.audio.currentTime);
        const total = this.formatTime(this.audio.duration);
        this.elements.timeDisplay.textContent = `${current} / ${total}`;
    }

    private formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        // Use toString() with conditional for padStart
        const paddedSeconds = remainingSeconds < 10 
            ? '0' + remainingSeconds 
            : remainingSeconds.toString();
        return `${minutes}:${paddedSeconds}`;
    }

    private onTrackEnd(): void {
        if (this.isRepeat) {
            this.audio.currentTime = 0;
            this.audio.play();
        } else if (this.isShuffle) {
            this.currentTrackIndex = Math.floor(Math.random() * this.playlist.length);
            this.loadTrack(this.currentTrackIndex);
        } else {
            this.nextTrack();
        }
    }
}

// src/components/Player.ts - Skeleton
import { SkinAssets } from '../types';
import Controls from './Controls';
import Display from './Display';
import Titlebar from './Titlebar';
import VolumeBar from './VolumeBar';

interface PlayerOptions {
  container: HTMLElement;
  skinAssets: SkinAssets;
}

export default class Player {
  private container: HTMLElement;
  private skinAssets: SkinAssets;
  private controls: Controls;
  private display: Display;
  private titlebar: Titlebar;
  private volumeBar: VolumeBar;

  constructor(options: PlayerOptions) {
    this.container = options.container;
    this.skinAssets = options.skinAssets;
    
    this.render();
    this.initComponents();
  }
  
  private render() {
    // Apply main skin background
    this.container.style.backgroundImage = `url(${this.skinAssets.main})`;
    this.container.style.width = '275px';
    this.container.style.height = '116px';
    this.container.style.imageRendering = 'pixelated';
  }

  private initComponents() {
    this.titlebar = new Titlebar({
      container: this.container,
      skinAssets: this.skinAssets
    });
    
    this.display = new Display({
      container: this.container,
      skinAssets: this.skinAssets
    });
    
    this.controls = new Controls({
      container: this.container,
      skinAssets: this.skinAssets
    });
    
    this.volumeBar = new VolumeBar({
      container: this.container,
      skinAssets: this.skinAssets
    });
  }
}