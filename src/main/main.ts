import {
  app,
  globalShortcut,
  Accelerator,
  Input,
  Menu,
  BrowserWindow,
  Tray } from 'electron';

import * as path from "path";
import Config from "@main/Config";

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
  });

  clipboardWindow.webContents.setIgnoreMenuShortcuts(true);
  const shortcutHandler = (event: Event, input: Input) => {
    if (input.type == 'keyDown' &&
        input.key == 'w' &&
        (input.control || input.meta)) {
      if (clipboardWindow.isFocused()) {
        clipboardWindow.close();
      }
    }
  };
  clipboardWindow.webContents.on('before-input-event', shortcutHandler);
  clipboardPanels.add(clipboardWindow);
  clipboardWindow.on('close', () => {
    clipboardPanels.delete(clipboardWindow);
  });
  clipboardWindow.loadURL(`file://${__dirname}/index.html#/clipboard`);
}

function showWindow(path: string): () => void {
  return () => {
    const window = new BrowserWindow({
      width: 400,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        devTools: process.env.NODE_ENV == 'development',
      },
    });
    window.setMenuBarVisibility(false);

    window.loadURL(`file://${__dirname}/index.html#/${path}`);
  }
}

function registerShortcut(accelerator: Accelerator, callback: () => void) {
  if (!globalShortcut.register(accelerator, callback)) {
    console.log(`registration failed: ${accelerator}`);
  }
}

let tray: Tray;

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'images', 'tray_icon.png'));

  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'About Pete', type: 'normal', click: showWindow('about'), },
    { type: 'separator' },
    { label: 'Preference', type: 'normal', click: showWindow('preference') },
    { label: 'Quit Pete', type: 'normal', click: app.quit },
  ]));

  const config = Config.load();
  registerShortcut(config.hotkey, showClipboardPanel);

  let allHidden = false;
  registerShortcut(config.toggleHideAll, () => {
    clipboardPanels.forEach(w => {
      if (allHidden) {
        w.show();
      } else {
        w.hide();
      }
    });
    allHidden = !allHidden;
  });
});

app.on('window-all-closed', () => {
  // do nothing
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
