// src/app.ts - Fixed and integrated with skin loader

import { SkinLoader, DEFAULT_SKIN_CONFIG } from './utils/skin-loader';
import { SkinAssets } from './src/assets/skins';
import { initAudio } from './src/utils/audio';

// Import components
import Controls from './src/components/Controls';
import Display from './src/components/Display';
import Equalizer from './src/components/Equalizer';
import Playlist from './src/components/Playlist';
import Titlebar from './src/components/Titlebar';
import VolumeBar from './src/components/VolumeBar';


// src/app.ts
import { SkinLoader } from './utils/skin-loader';
import Player from './components/Player';

const SKIN_CONFIG = {
  baseUrl: 'https://coda-projects.s3.ap-south-1.amazonaws.com/my-winamp/winamp-skin',
  name: 'Old Mac-OS'
};

async function initApp() {
  try {
    // Load skin first
    const skinLoader = new SkinLoader(SKIN_CONFIG);
    const assets = await skinLoader.loadSkin();
    
    // Initialize player with loaded skin
    const player = new Player({
      container: document.getElementById('winamp'),
      skinAssets: assets
    });
    
    console.log('✅ Winamp initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Winamp:', error);
  }
}

initApp();
 
// src/app.ts - Fixed and integrated with skin loader
class WinampPlayer {
    private container: HTMLElement;
    private skinLoader: SkinLoader | null = null;
    private skinAssets: SkinAssets | null = null;
    
    // Components
    private titlebar!: Titlebar;
    private display!: Display;
    private controls!: Controls;
    private equalizer!: Equalizer;
    private playlist!: Playlist;
    private volumeBar!: VolumeBar;

    constructor() {
        this.container = document.getElementById('winamp') as HTMLElement;
        if (!this.container) {
            throw new Error('Winamp container not found');
        }
        
        // Initialize asynchronously
        this.init();
    }

    private async init(): Promise<void> {
        try {
            // Show loading state
            this.showLoading();
            
            // Load skin first
            await this.loadSkin();
            
            // Initialize components with skin assets
            this.initializeComponents();
            
            // Setup the player
            this.initialize();
            
            console.log('✅ Winamp player initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Winamp:', error);
            this.showError(error as Error);
        }
    }

    private showLoading(): void {
        this.container.innerHTML = `
            <div class="winamp-loading">
                <div class="spinner"></div>
                <p>Loading Winamp...</p>
            </div>
        `;
    }

    private showError(error: Error): void {
        this.container.innerHTML = `
            <div class="winamp-error">
                <h2>⚠️ Failed to Load Winamp</h2>
                <p>${error.message}</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
    }



    private async loadSkin(): Promise<void> {
        console.log('🎨 Loading skin...');
        
        // Create skin loader with S3 config
        this.skinLoader = new SkinLoader(DEFAULT_SKIN_CONFIG);
        
        // Load all skin assets
        this.skinAssets = await this.skinLoader.loadSkin();
        
        console.log('✅ Skin loaded:', Object.keys(this.skinAssets).length, 'assets');
    }

    private initializeComponents(): void {
        if (!this.skinAssets) {
            throw new Error('Skin assets not loaded');
        }

        // Initialize all components with skin assets
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

        this.equalizer = new Equalizer({
            container: this.container,
            skinAssets: this.skinAssets
        });

        this.playlist = new Playlist({
            container: this.container,
            skinAssets: this.skinAssets
        });

        this.volumeBar = new VolumeBar({
            container: this.container,
            skinAssets: this.skinAssets
        });
    }

    private initialize(): void {
        this.setupEventListeners();
        this.renderComponents();
        initAudio();
    }


    
    private setupEventListeners(): void {
        // Listen for control events
        document.addEventListener('winamp:control', (e: Event) => {
            const customEvent = e as CustomEvent;
            const action = customEvent.detail.action;

            switch (action) {
                case 'play':
                    this.handlePlay();
                    break;
                case 'pause':
                    this.handlePause();
                    break;
                case 'stop':
                    this.handleStop();
                    break;
                case 'next':
                    this.handleNext();
                    break;
                case 'prev':
                    this.handlePrevious();
                    break;
                case 'eject':
                    this.handleEject();
                    break;
            }
        });

        // Listen for volume changes
        document.addEventListener('winamp:volume', (e: Event) => {
            const customEvent = e as CustomEvent;
            const volume = customEvent.detail.volume;
            this.playlist.setVolume(volume);
        });

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    private setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            // Don't trigger if user is typing in input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.handlePrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.handleNext();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.volumeUp();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.volumeDown();
                    break;
            }
        });
    }

    private handlePlay(): void {
        this.playlist.play();
        this.display.updateTrackInfo(this.playlist.getCurrentTrack());
    }

    private handlePause(): void {
        this.playlist.pause();
        this.display.updateTrackInfo(this.playlist.getCurrentTrack());
    }

    private handleStop(): void {
        this.playlist.pause();
        this.playlist.seekTo(0);
        this.display.updateTrackInfo(this.playlist.getCurrentTrack());
    }

    private handleNext(): void {
        this.playlist.next();
        this.display.updateTrackInfo(this.playlist.getCurrentTrack());
    }

    private handlePrevious(): void {
        this.playlist.previous();
        this.display.updateTrackInfo(this.playlist.getCurrentTrack());
    }

    private handleEject(): void {
        // Open file selector or playlist
        console.log('Eject clicked - open file selector');
        // You can implement file selection here
    }

    private togglePlay(): void {
        if (this.playlist.isPlaying()) {
            this.handlePause();
        } else {
            this.handlePlay();
        }
    }

    private volumeUp(): void {
        const currentVolume = this.playlist.getVolume();
        const newVolume = Math.min(100, currentVolume + 5);
        this.volumeBar.setVolume(newVolume);
        this.playlist.setVolume(newVolume);
    }

    private volumeDown(): void {
        const currentVolume = this.playlist.getVolume();
        const newVolume = Math.max(0, currentVolume - 5);
        this.volumeBar.setVolume(newVolume);
        this.playlist.setVolume(newVolume);
    }

    private renderComponents(): void {
        // Clear container (remove loading message)
        this.container.innerHTML = '';

        // Apply main skin background
        if (this.skinAssets?.main) {
            this.container.style.backgroundImage = `url(${this.skinAssets.main})`;
            this.container.style.backgroundSize = '275px 116px';
            this.container.style.backgroundRepeat = 'no-repeat';
            this.container.style.width = '275px';
            this.container.style.height = '116px';
        }

        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Render all components
        fragment.appendChild(this.titlebar.render());
        fragment.appendChild(this.display.render());
        fragment.appendChild(this.controls.render());
        fragment.appendChild(this.equalizer.render());
        fragment.appendChild(this.playlist.render());
        fragment.appendChild(this.volumeBar.render());

        // Add all components to container at once
        this.container.appendChild(fragment);
    }

    // Public methods for external control
    public play(): void {
        this.handlePlay();
    }

    public pause(): void {
        this.handlePause();
    }

    public stop(): void {
        this.handleStop();
    }

    public nextTrack(): void {
        this.handleNext();
    }

    public previousTrack(): void {
        this.handlePrevious();
    }

    public toggleShuffle(): void {
        this.playlist.toggleShuffle();
    }

    public toggleRepeat(): void {
        this.playlist.toggleRepeat();
    }

    public toggleMute(): void {
        this.playlist.toggleMute();
    }

    public setVolume(volume: number): void {
        this.volumeBar.setVolume(volume);
        this.playlist.setVolume(volume);
    }

    public handleResize(): void {
        // Handle window resize if needed
        console.log('Window resized');
    }

    public dispose(): void {
        // Cleanup
        if (this.skinLoader) {
            this.skinLoader.dispose();
        }
        console.log('Winamp player disposed');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.winamp = new WinampPlayer();
        console.log('🎵 Winamp player starting...');
    } catch (error) {
        console.error('❌ Failed to initialize Winamp:', error);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.winamp) {
        window.winamp.dispose();
    }
});

// Global type declaration
declare global {
    interface Window {
        winamp: WinampPlayer;
    }
}

export default WinampPlayer;