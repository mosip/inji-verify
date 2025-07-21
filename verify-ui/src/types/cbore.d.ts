declare module "cbor-web" {
  export function decode(input: Uint8Array): any;
  export function encode(input: any): Uint8Array;
}