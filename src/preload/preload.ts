import { contextBridge, ipcRenderer } from 'electron';
import {AppInfo, AppWindow, Clipboard, Shell} from "@main/ipc";
import {ClipboardFormat, Image} from "@/@types/global";

contextBridge.exposeInMainWorld('clipboard', {
  clipboardFormat(): Promise<ClipboardFormat> {
    return ipcRenderer.invoke(Clipboard.Channel.ClipboardFormat);
  },
  readHTML(): Promise<string> {
    return ipcRenderer.invoke(Clipboard.Channel.ReadHTML);
  },
  readText(): Promise<string> {
    return ipcRenderer.invoke(Clipboard.Channel.ReadText);
  },
  readImage(): Promise<Image> {
    return ipcRenderer.invoke(Clipboard.Channel.ReadImage);
  },
})

contextBridge.exposeInMainWorld('appInfo', {
  name(): Promise<string> {
    return ipcRenderer.invoke(AppInfo.Channel.Name);
  },
  version(): Promise<string> {
    return ipcRenderer.invoke(AppInfo.Channel.Version);
  }
})

contextBridge.exposeInMainWorld('shell', {
  openExternal(url: string): void {
    ipcRenderer.invoke(Shell.Channel.OpenExternal, url);
  }
})

contextBridge.exposeInMainWorld('appWindow', {
  resize(width: number, height: number): Promise<void> {
    return ipcRenderer.invoke(AppWindow.Channel.Resize, width, height);
  },
  copyImage(): Promise<void> {
    return ipcRenderer.invoke(AppWindow.Channel.CopyImage);
  }
})
