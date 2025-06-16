declare module 'aplayer' {
  interface APlayerAudio {
    name: string;
    artist: string;
    url: string;
    cover: string;
    lrc?: string;
    theme?: string;
  }

  interface APlayerOptions {
    container: HTMLElement;
    fixed?: boolean;
    mini?: boolean;
    autoplay?: boolean;
    theme?: string;
    loop?: 'all' | 'one' | 'none';
    order?: 'list' | 'random';
    preload?: 'auto' | 'metadata' | 'none';
    volume?: number;
    audio: APlayerAudio | APlayerAudio[];
    customAudioType?: {
      [key: string]: (audioElement: HTMLAudioElement, audio: APlayerAudio, player: APlayer) => void;
    };
    mutex?: boolean;
    lrcType?: number;
    listFolded?: boolean;
    listMaxHeight?: string;
    storageName?: string;
  }

  interface APlayerEvents {
    'abort': () => void;
    'canplay': () => void;
    'canplaythrough': () => void;
    'durationchange': () => void;
    'emptied': () => void;
    'ended': () => void;
    'error': (error: any) => void;
    'loadeddata': () => void;
    'loadedmetadata': () => void;
    'loadstart': () => void;
    'mozaudioavailable': () => void;
    'pause': () => void;
    'play': () => void;
    'playing': () => void;
    'progress': () => void;
    'ratechange': () => void;
    'seeked': () => void;
    'seeking': () => void;
    'stalled': () => void;
    'suspend': () => void;
    'timeupdate': () => void;
    'volumechange': () => void;
    'waiting': () => void;
    'listshow': () => void;
    'listhide': () => void;
    'listadd': () => void;
    'listremove': () => void;
    'listswitch': () => void;
    'listclear': () => void;
    'noticeshow': () => void;
    'noticehide': () => void;
    'destroy': () => void;
    'lrcshow': () => void;
    'lrchide': () => void;
  }

  class APlayer {
    constructor(options: APlayerOptions);
    
    // Properties
    audio: HTMLAudioElement;
    container: HTMLElement;
    
    // Methods
    play(): void;
    pause(): void;
    seek(time: number): void;
    toggle(): void;
    on<K extends keyof APlayerEvents>(event: K, handler: APlayerEvents[K]): void;
    destroy(): void;
    setMode(mode: 'normal' | 'mini'): void;
    notice(text: string, time?: number, opacity?: number): void;
    skipBack(): void;
    skipForward(): void;
    showLrc(): void;
    hideLrc(): void;
    toggleLrc(): void;
    showList(): void;
    hideList(): void;
    toggleList(): void;
    addAudio(audio: APlayerAudio): void;
    removeAudio(index: number): void;
    switchAudio(index: number): void;
    setAudio(audio: APlayerAudio): void;
    setLoop(loop: 'all' | 'one' | 'none'): void;
    setOrder(order: 'list' | 'random'): void;
    setVolume(percentage: number): void;
    theme(color?: string, index?: number): void;
    
    // Getters
    mode: 'normal' | 'mini';
    theme: string;
    loop: 'all' | 'one' | 'none';
    order: 'list' | 'random';
    volume: number;
    list: APlayerAudio[];
    audios: APlayerAudio[];
  }

  export = APlayer;
}
