// src/skin-loader.ts
// Winamp Skin Loader for loading skins from S3 or local paths

export interface SkinConfig {
  baseUrl: string;
  name: string;
}

export interface SkinAssets {
  main: string;
  titlebar: string;
  cbuttons: string;
  shufrep: string;
  volume: string;
  balance: string;
  monoster: string;
  posbar: string;
  playpaus: string;
  numbers: string;
  text: string;
  eqmain: string;
  pledit: string;
  eq_ex: string;
  gen: string;
  genex: string;
  mb: string;
  avs: string;
  video: string;
  // Text configuration files
  pleditTxt?: string;
  viscolorTxt?: string;
  regionTxt?: string;
}

export class SkinLoader {
  private baseUrl: string;
  private skinName: string;
  private assets: Partial<SkinAssets> = {};
  private loadedImages: Map<string, HTMLImageElement> = new Map();

  // Required BMP files for a Winamp skin
  private readonly requiredFiles = [
    'Main.bmp',
    'Titlebar.bmp',
    'CButtons.bmp',
    'ShufRep.bmp',
    'Volume.bmp',
    'Balance.bmp',
    'MonoSter.bmp',
    'PosBar.bmp',
    'PlayPaus.bmp',
    'Numbers.bmp',
    'Text.bmp',
    'EqMain.bmp',
    'PLEdit.bmp',
    'Eq_Ex.bmp',
    'Gen.bmp',
    'Genex.bmp',
    'Mb.bmp',
    'Avs.bmp',
    'Video.bmp'
  ];


  constructor(config: SkinConfig) {
    this.baseUrl = config.baseUrl;
    this.skinName = config.name;
  }

  /**
   * Load all skin assets from the configured URL
   */
  async loadSkin(): Promise<SkinAssets> {
    console.log(`Loading skin: ${this.skinName} from ${this.baseUrl}`);
    
    const loadPromises = this.requiredFiles.map(file => 
      this.loadAsset(file)
    );

    try {
      await Promise.all(loadPromises);
      console.log('Skin loaded successfully');
      return this.assets as SkinAssets;
    } catch (error) {
      console.error('Error loading skin:', error);
      throw error;
    }
  }

  /**
   * Load a single asset file
   */
  private async loadAsset(filename: string): Promise<void> {
    const url = `${this.baseUrl}/${filename}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.statusText}`);
      }

      // For BMP files, create blob URL
      if (filename.endsWith('.bmp')) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        // Load image to verify it's valid
        const img = await this.loadImage(blobUrl);
        this.loadedImages.set(filename, img);
        
        // Store in assets with lowercase key (matching interface)
        const key = filename.replace('.bmp', '').toLowerCase();
        this.assets[key as keyof SkinAssets] = blobUrl;
      } 
      // For text files
      else if (filename.endsWith('.txt')) {
        const text = await response.text();
        const key = filename.replace('.txt', '') + 'Txt';
        this.assets[key as keyof SkinAssets] = text;
      }
    } catch (error) {
      console.warn(`Could not load ${filename}:`, error);
      // Don't throw - continue with other assets
    }
  }

  /**
   * Load an image and return a promise that resolves when loaded
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Get a specific sprite from a sprite sheet
   */
  getSpriteDataUrl(
    filename: string, 
    x: number, 
    y: number, 
    width: number, 
    height: number
  ): string | null {
    const img = this.loadedImages.get(filename);
    if (!img) {
      console.warn(`Image not loaded: ${filename}`);
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Could not get canvas context');
      return null;
    }

    // Draw the specific sprite region
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
    
    return canvas.toDataURL();
  }

  /**
   * Create a tiled background from a sprite
   */
  createTiledBackground(
    filename: string,
    spriteX: number,
    spriteY: number,
    spriteWidth: number,
    spriteHeight: number,
    targetWidth: number,
    targetHeight: number
  ): string | null {
    const img = this.loadedImages.get(filename);
    if (!img) return null;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Extract the sprite first
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteWidth;
    spriteCanvas.height = spriteHeight;
    const spriteCtx = spriteCanvas.getContext('2d');
    if (!spriteCtx) return null;

    spriteCtx.drawImage(
      img, 
      spriteX, spriteY, spriteWidth, spriteHeight,
      0, 0, spriteWidth, spriteHeight
    );

    // Tile it
    for (let y = 0; y < targetHeight; y += spriteHeight) {
      for (let x = 0; x < targetWidth; x += spriteWidth) {
        ctx.drawImage(spriteCanvas, x, y);
      }
    }

    return canvas.toDataURL();
  }

  /**
   * Get loaded assets
   */
  getAssets(): Partial<SkinAssets> {
    return this.assets;
  }

  /**
   * Clean up blob URLs
   */
  dispose(): void {
    Object.values(this.assets).forEach(url => {
      if (typeof url === 'string' && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.assets = {};
    this.loadedImages.clear();
  }
}

// Sprite position constants for the Old Mac-OS skin
export const SPRITE_POSITIONS = {
  // Main.bmp (275x116)
  MAIN: {
    NORMAL: { x: 0, y: 0, width: 275, height: 116 },
    WINDOWSHADE: { x: 0, y: 116, width: 275, height: 14 }
  },
  
  // Titlebar.bmp (275x29)
  TITLEBAR: {
    ACTIVE: { x: 27, y: 0, width: 275, height: 14 },
    INACTIVE: { x: 27, y: 15, width: 275, height: 14 }
  },

  // CButtons.bmp (23x18 each button)
  CBUTTONS: {
    PREV: { x: 0, y: 0, width: 23, height: 18 },
    PREV_PRESSED: { x: 0, y: 18, width: 23, height: 18 },
    PLAY: { x: 23, y: 0, width: 23, height: 18 },
    PLAY_PRESSED: { x: 23, y: 18, width: 23, height: 18 },
    PAUSE: { x: 46, y: 0, width: 23, height: 18 },
    PAUSE_PRESSED: { x: 46, y: 18, width: 23, height: 18 },
    STOP: { x: 69, y: 0, width: 23, height: 18 },
    STOP_PRESSED: { x: 69, y: 18, width: 23, height: 18 },
    NEXT: { x: 92, y: 0, width: 23, height: 18 },
    NEXT_PRESSED: { x: 92, y: 18, width: 23, height: 18 },
    EJECT: { x: 114, y: 0, width: 22, height: 16 },
    EJECT_PRESSED: { x: 114, y: 16, width: 22, height: 16 }
  },

  // Numbers.bmp (9x13 each digit)
  NUMBERS: {
    WIDTH: 9,
    HEIGHT: 13,
    // Positions: 0-9 in first row, then : - in second row
  },

  // ShufRep.bmp
  SHUFREP: {
    SHUFFLE_OFF: { x: 28, y: 0, width: 47, height: 15 },
    SHUFFLE_ON: { x: 28, y: 15, width: 47, height: 15 },
    REPEAT_OFF: { x: 0, y: 0, width: 28, height: 15 },
    REPEAT_ON: { x: 0, y: 15, width: 28, height: 15 }
  },

  // Volume.bmp (68x13)
  VOLUME: {
    SLIDER_BG: { x: 0, y: 0, width: 68, height: 13 },
    SLIDER_THUMB: { x: 15, y: 422, width: 14, height: 11 }
  },

  // Balance.bmp (38x13)
  BALANCE: {
    SLIDER_BG: { x: 9, y: 0, width: 38, height: 13 },
    SLIDER_THUMB: { x: 15, y: 422, width: 14, height: 11 }
  },

  // PosBar.bmp (248x10)
  POSBAR: {
    BG: { x: 0, y: 0, width: 248, height: 10 },
    THUMB: { x: 248, y: 0, width: 29, height: 10 }
  },

  // MonoSter.bmp
  MONOSTER: {
    STEREO: { x: 0, y: 12, width: 29, height: 12 },
    MONO: { x: 29, y: 0, width: 29, height: 12 }
  },

  // PlayPaus.bmp
  PLAYPAUS: {
    PLAYING: { x: 36, y: 0, width: 9, height: 9 },
    PAUSED: { x: 27, y: 0, width: 9, height: 9 },
    STOPPED: { x: 18, y: 0, width: 9, height: 9 }
  },

  // EQ and PL buttons
  EQ_PL_BUTTONS: {
    EQ_NORMAL: { x: 0, y: 0, width: 23, height: 12 },
    EQ_PRESSED: { x: 0, y: 12, width: 23, height: 12 },
    PL_NORMAL: { x: 23, y: 0, width: 23, height: 12 },
    PL_PRESSED: { x: 23, y: 12, width: 23, height: 12 }
  }
};

// Default skin configuration for Old Mac-OS skin
export const DEFAULT_SKIN_CONFIG: SkinConfig = {
  baseUrl: 'https://coda-projects.s3.ap-south-1.amazonaws.com/my-winamp/winamp-skin',
  name: 'Old Mac-OS'
};