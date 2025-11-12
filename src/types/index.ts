// src/types/index.ts - Add these interfaces
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
}

export interface SkinConfig {
  baseUrl: string;
  name: string;
}

export interface WinampState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  isRepeat: boolean;
  currentTrack?: Track;
}

export interface Track {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  url: string;
}