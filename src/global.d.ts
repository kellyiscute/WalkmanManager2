declare interface Window {
  api: {
    selectDirectory: () => Promise<string>
  }
}

declare interface MusicMetadata {
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
}
