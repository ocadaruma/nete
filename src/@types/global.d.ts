declare global {
  interface Window {
    clipboard: Clipboard
    appInfo: AppInfo
    shell: Shell
    appWindow: AppWindow
  }
}

export interface Clipboard {
  clipboardFormat(): Promise<ClipboardFormat>
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

export type ClipboardFormat = "Text" | "Html" | "Image";

export interface Image {
  width: number
  height: number
  dataUrl: string
}
