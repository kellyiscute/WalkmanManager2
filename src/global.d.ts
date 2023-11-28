declare interface Window {
  api: {
    selectDirectory: () => Promise<string>
  }
}
