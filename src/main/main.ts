import {
  app,
  globalShortcut,
  systemPreferences,
  Input,
  Menu,
  BrowserWindow,
  Tray, ipcMain, shell
} from 'electron';

import * as path from "path";
import Config from "@main/config";
import Accelerator = Electron.Accelerator;
import * as process from "process";
import {Clipboard, Shell, AppInfo, AppWindow} from "@main/ipc";
import { clip } from "@main/clip";

interface ClipboardWindow {
  browserWindow: BrowserWindow
  image: Buffer | null
}

// prevent duplicated process
if (!app.requestSingleInstanceLock()) {
  app.exit(1);
}

// lookup table from WebContents id to the window
const clipboardWindows: Map<number, ClipboardWindow> = new Map();
function showClipboardPanel() {
  const clipboardWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      devTools: process.env.NODE_ENV == 'development',
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false,
    alwaysOnTop: true,
    icon: path.join(__dirname, 'images', 'icon.png'),
  });

  const shortcutHandler = (event: Event, input: Input) => {
    if (input.type == 'keyDown') {
      if (input.key == 'w' && (input.control || input.meta)) {
        if (clipboardWindow.isFocused()) {
          clipboardWindow.close();
        }
      } else if (input.key == 'r' && (input.control || input.meta)) {
        event.preventDefault();
      }
    }
  };
  clipboardWindow.webContents.on('before-input-event', shortcutHandler);
  clipboardWindows.set(clipboardWindow.webContents.id, {
    browserWindow: clipboardWindow,
    image: null,
  });
  clipboardWindow.once('close', () => {
    clipboardWindows.delete(clipboardWindow.webContents.id);
  });
  clipboardWindow.loadURL(`file://${__dirname}/index.html#/clipboard`);
  clipboardWindow.webContents.openDevTools()
}

const openPanels: Map<string, BrowserWindow> = new Map();
function showWindow(panelPath: string): () => void {
  return () => {
    if (openPanels.has(panelPath)) {
      openPanels.get(panelPath)!.focus();
      return;
    }
    const window = new BrowserWindow({
      width: 300,
      height: 400,
      webPreferences: {
        devTools: process.env.NODE_ENV == 'development',
        preload: path.join(__dirname, 'preload.js'),
      },
      icon: path.join(__dirname, 'images', 'icon.png'),
      resizable: false,
      maximizable: false,
    });
    openPanels.set(panelPath, window);

    window.setMenuBarVisibility(false);
    window.once('close', () => {
      openPanels.delete(panelPath);
    });
    window.loadURL(`file://${__dirname}/index.html#/${panelPath}`);
    window.webContents.openDevTools()
  }
}

function registerShortcut(accelerator: Accelerator, callback: () => void) {
  if (!globalShortcut.register(accelerator, callback)) {
    console.log(`registration failed: ${accelerator}`);
  }
}

function setupIpc() {
  ipcMain.handle(Clipboard.Channel.ClipboardFormat,
      () => clip.clipboardFormat());
  ipcMain.handle(Clipboard.Channel.ReadHTML,
      () => clip.readHTML());
  ipcMain.handle(Clipboard.Channel.ReadText,
      () => clip.readText());
  ipcMain.handle(Clipboard.Channel.ReadImage, async event => {
    const imageData = await clip.readImage();
    const clipboardWindow = clipboardWindows.get(event.sender.id);
    if (clipboardWindow) {
      clipboardWindow.image = imageData.data;
    }
    return imageData.image;
  });
  ipcMain.handle(Shell.Channel.OpenExternal,
      (event, url) => shell.openExternal(url));
  ipcMain.handle(AppInfo.Channel.Name,
      () => app.getName());
  ipcMain.handle(AppInfo.Channel.Version,
      () => app.getVersion());
  ipcMain.handle(AppWindow.Channel.Resize,
      (event, w, h) =>
          BrowserWindow.fromWebContents(event.sender)?.setSize(w, h, false))
  ipcMain.handle(AppWindow.Channel.CopyImage, async event => {
    const clipboardWindow = clipboardWindows.get(event.sender.id);
    if (clipboardWindow && clipboardWindow.image) {
      await clip.writeImage(clipboardWindow.image);
    }
  });
}

let tray: Tray;
app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: app.name, submenu: [ { role: 'quit' } ]},
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    }
  ]));

  if (process.platform == 'darwin') {
    tray = new Tray(path.join(__dirname, 'images', 'tray_iconTemplate.png'));
  } else {
    tray = new Tray(path.join(__dirname, 'images', 'tray_icon.png'));
  }

  tray.setContextMenu(Menu.buildFromTemplate([
    { label: `About ${app.name}`, click: showWindow('about'), },
    { type: 'separator' },
    { label: 'Preference', click: showWindow('preference') },
    { role: 'quit' },
  ]));

  const config = Config.load();
  registerShortcut(config.hotkey, showClipboardPanel);

  let allHidden = false;
  registerShortcut(config.toggleHideAll, () => {
    clipboardWindows.forEach(window => {
      if (allHidden) {
        window.browserWindow.show();
      } else {
        window.browserWindow.hide();
      }
    });
    allHidden = !allHidden;
  });

  setupIpc();
});

if (process.platform == 'darwin') {
  (<any>systemPreferences).setUserDefault('NSDisabledDictationMenuItem', 'boolean', true);
  (<any>systemPreferences).setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true);
}

// this app should be daemonized at task tray
app.on('window-all-closed', () => {
  // do nothing
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
