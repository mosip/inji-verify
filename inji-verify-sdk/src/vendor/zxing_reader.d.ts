declare module "../vendor/zxing_reader.js" {
    interface ZXingResult {
      text: string;
      bytes: Uint8Array;
      format: string;
    }
  
    interface ZXingReader {
      readBarcodesFromImage(
        buffer: number,
        length: number,
        tryHarder: boolean,
        format: string,
        maxSymbolSize: number
      ): {
        size(): number;
        get(index: number): ZXingResult;
        delete(): void;
      };
    }
  
    interface ZXingModule {
      Reader: new () => ZXingReader;
      HEAPU8: Uint8Array;
      _malloc(size: number): number;
      _free(ptr: number): void;
    }
  
    const ZXingFactory: () => Promise<ZXingModule>;
    export default ZXingFactory;
  }
  