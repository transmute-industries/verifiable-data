export interface EncodeHashlinkOptions {
  data?: string | Uint8Array;
  urls?: string[];
  url?: string;
  codecs?: string[];
  transform?: string[];
  meta?: any;
}

export interface VerifyHashlinkOptions {
  hashlink: string;
  data?: string | Uint8Array;
  resolvers?: any;
}
