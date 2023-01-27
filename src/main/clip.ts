// provide APIs for clipboard

import {clipboard, nativeImage} from "electron";
import {parsePngFormat} from "png-dpi-reader-writer";
import {ClipboardFormat, Image} from "@/@types/global";
import * as process from "process";
import * as electron from "electron";

// As of Jan 2023, macOS has a concept called "scale factor" to display images.
// (refs: https://developer.apple.com/design/human-interface-guidelines/foundations/images)
// Scale factor is used to show images with high density in high resolution display (i.e. Retina).
//
// For example, a 800x600 image in 2x scale factor will be rendered in same size as 400x300
// in apps that support scale factor (e.g. Preview app, Quick look etc).
// refs: https://mybyways.com/blog/fixing-high-dpi-retina-screenshot-metadata
//
// Then how these apps detect scale factor of images?
// There are two ways. 1) Check if the filename is suffixed with "@2x" 2) Check pHYs metadata in png file.
// For 2), seems PNGs have 144 DPI pHYs metadata are treated as 2x scale factor. (Not sure if it's documented somewhere)
//
// To show these "high-resolution" images in expected physical size, we have to scale the image size
// for images that have 2x scale factor. Without this, image will be displayed in double size of expected size.
// (Because simply it has double size in pixel)
//
// From the experiment, seems possible value of scale factor is only 1x (default) or 2x (144 dpi in pHYs) in macOS.
// (Even we edit pHYs dpi to 216, 288, it didn't make any change in display)
const MACOS_PNG_DPI_2X = 144;

export namespace clip {
  export interface ImageData {
    image: Image
    data: Buffer
  }

  export function clipboardFormat(): ClipboardFormat {
    const formats = clipboard.availableFormats();

    if (formats.some(format => format == 'text/html')) {
      return "Html";
    }
    if (formats.some(format => format.startsWith('image/'))) {
      return "Image";
    }
    return "Text";
  }

  export function writeImage(data: Buffer): void {
    if (process.platform == 'darwin') {
      clipboard.writeBuffer('public.png', data);
    } else {
      clipboard.writeImage(nativeImage.createFromBuffer(data));
    }
  }

  export function readImage(): ImageData {
    const electronImage = clipboard.readImage();
    let buffer = clipboard.readImage().toPNG();
    if (process.platform == 'darwin') {
      let maybeBuffer = clipboard.readBuffer('public.png');
      if (maybeBuffer.length > 0) {
        buffer = maybeBuffer;
      }
    }
    const res = parsePngFormat(buffer);
    const factor = res.dpi === MACOS_PNG_DPI_2X ? 2 : 1;
    const { width, height } = electronImage.getSize();
    return {
      image: {
        width: width / factor,
        height: height / factor,
        dataUrl: `data:image/png;base64,${buffer.toString('base64')}`,
      },
      data: buffer,
    };
  }

  export function readText(): string {
    return clipboard.readText();
  }

  export function readHTML(): string {
    return clipboard.readHTML();
  }
}
