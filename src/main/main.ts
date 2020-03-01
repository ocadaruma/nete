import {
  app,
  globalShortcut,
  systemPreferences,
  Accelerator,
  Input,
  Menu,
  BrowserWindow,
  Tray } from 'electron';

import * as path from "path";
import Config from "@main/Config";

// prevent duplicated process
if (!app.requestSingleInstanceLock()) {
  app.exit(1);
}

const clipboardPanels: Set<BrowserWindow> = new Set();
function showClipboardPanel() {
  const clipboardWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      devTools: process.env.NODE_ENV == 'development',
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
  clipboardPanels.add(clipboardWindow);
  clipboardWindow.once('close', () => {
    clipboardPanels.delete(clipboardWindow);
  });
  clipboardWindow.loadURL(`file://${__dirname}/index.html#/clipboard`);
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
        nodeIntegration: true,
        devTools: process.env.NODE_ENV == 'development',
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
  }
}

function registerShortcut(accelerator: Accelerator, callback: () => void) {
  if (!globalShortcut.register(accelerator, callback)) {
    console.log(`registration failed: ${accelerator}`);
  }
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
    clipboardPanels.forEach(window => {
      if (allHidden) {
        window.show();
      } else {
        window.hide();
      }
    });
    allHidden = !allHidden;
  });
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
