export namespace Clipboard {
  export enum Channel {
    AvailableFormats = 'Clipboard_AvailableFormats',
    ReadHTML = 'Clipboard_ReadHTML',
    ReadText = 'Clipboard_ReadText',
  }
}

export namespace Shell {
  export enum Channel {
    OpenExternal = 'Shell_OpenExternal',
  }
}

export namespace AppInfo {
  export enum Channel {
    Name = 'AppInfo_Name',
    Version = 'AppInfo_Version',
  }
}
