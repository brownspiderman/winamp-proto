# Winamp-Style Music Player

## Overview
This project is a Winamp-style music player web application that replicates the classic interface and functionality of the original Winamp player. It features playback controls, a playlist manager, and an equalizer, all designed to provide a seamless music listening experience.

## Features
- **Playback Controls**: Play, pause, stop, next, and previous track functionality.
- **Track Display**: Shows the current track title and playback time.
- **Playlist Management**: Allows users to view and select tracks from a playlist.
- **Equalizer**: Adjust audio frequencies for a customized listening experience.
- **Volume Control**: A slider to adjust the audio volume.

## Project Structure
```
winamp-player
├── src
│   ├── assets
│   │   ├── fonts
│   │   └── skins
│   ├── components
│   │   ├── Controls.ts
│   │   ├── Display.ts
│   │   ├── Equalizer.ts
│   │   ├── Playlist.ts
│   │   ├── Titlebar.ts
│   │   └── VolumeBar.ts
│   ├── styles
│   │   ├── components
│   │   │   └── index.css
│   │   └── main.css
│   ├── utils
│   │   ├── audio.ts
│   │   └── helpers.ts
│   ├── app.ts
│   └── types
│       └── index.ts
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd winamp-player
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage
1. Open `index.html` in your web browser.
2. Use the playback controls to manage your music.
3. Adjust the volume and equalizer settings as desired.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.