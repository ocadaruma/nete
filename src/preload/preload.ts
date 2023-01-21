import { contextBridge, ipcRenderer } from 'electron';
import { AppInfo, Clipboard, Shell } from "@main/ipc";

contextBridge.exposeInMainWorld('clipboard', {
  availableFormats(): Promise<string[]> {
    return ipcRenderer.invoke(Clipboard.Channel.AvailableFormats);
  },
  readHTML(): Promise<string> {
    return ipcRenderer.invoke(Clipboard.Channel.ReadHTML);
  },
  readText(): Promise<string> {
    return ipcRenderer.invoke(Clipboard.Channel.ReadText);
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
  openExternal(url: string): Promise<void> {
    return ipcRenderer.invoke(Shell.Channel.OpenExternal, url);
  }
})
