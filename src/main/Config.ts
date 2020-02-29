import Accelerator = Electron.Accelerator;

export default class Config {
  hotkey: Accelerator;
  toggleHideAll: Accelerator;

  static load(): Config {
    const config = new Config();

    // TBD
    if (process.platform == 'darwin') {
      config.hotkey = 'Shift+Command+S';
      config.toggleHideAll = 'Shift+Command+H';
    } else {
      config.hotkey = 'Shift+Super+S';
      config.toggleHideAll = 'Shift+Super+H';
    }

    return config;
  }
}
