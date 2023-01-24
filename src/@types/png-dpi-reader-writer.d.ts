declare module 'png-dpi-reader-writer' {
  function parsePngFormat(buffer: ArrayBufferLike): PngResolution;

  interface PngResolution {
    width: number | undefined
    height: number | undefined
    dpi: number | undefined
  }
}
