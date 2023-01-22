declare global {
  interface Window {
    clipboard: Clipboard
    appInfo: AppInfo
    shell: Shell
    appWindow: AppWindow
  }
}

export interface Clipboard {
  availableFormats(): Promise<string[]>
  readHTML(): Promise<string>
  readText(): Promise<string>
  readImage(): Promise<Image>
}

export interface AppInfo {
  name(): Promise<string>
  version(): Promise<string>
}

export interface Shell {
  openExternal(url: string): void
}

export interface AppWindow {
  resize(width: number, height: number): void
  copyImage(): Promise<void>
}

export interface Image {
  width: number
  height: number
  dataUrl: string
}
