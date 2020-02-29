import {
  app,
  globalShortcut,
  Menu,
  BrowserWindow,
  Tray } from 'electron';

import * as path from "path";
import Config from "@main/Config";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      devTools: process.env.NODE_ENV == 'development',
    },
    frame: false,
    // alwaysOnTop: true,
  });

  // mainWindow.webContents.openDevTools();
  mainWindow.loadURL(`file://${__dirname}/index.html#/clipboard`);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

let tray: Tray;
app.on('ready', () => {
  tray = new Tray(path.join(__dirname, 'images', 'tray_icon.png'));

  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'About Pete', type: 'normal' },
    { type: 'separator' },
    { label: 'Show Main Window', type: 'normal' },
    { label: 'Quit Pete', type: 'normal', click: () => {}, },
  ]));
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});
