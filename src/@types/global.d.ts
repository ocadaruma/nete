declare global {
  interface Window {
    clipboard: Clipboard
    appInfo: AppInfo
    shell: Shell
  }
}

export interface Clipboard {
  availableFormats(): Promise<string[]>
  readHTML(): Promise<string>

  readText(): Promise<string>
}

export interface AppInfo {
  name(): Promise<string>
  version(): Promise<string>
}

export interface Shell {
  openExternal(url: string): void
}
