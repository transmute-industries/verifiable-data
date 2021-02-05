import { Hashlink } from './Hashlink';
import * as defaultCodecs from './codecs';
import { EncodeHashlinkOptions, VerifyHashlinkOptions } from './types';

const hlDefault = new Hashlink();
hlDefault.use(new defaultCodecs.MultihashSha2256());
hlDefault.use(new defaultCodecs.MultihashBlake2b64());
hlDefault.use(new defaultCodecs.MultibaseBase58btc());

export { Hashlink, defaultCodecs };

export const encode = async ({
  data,
  urls,
  url,
  codecs = ['mh-sha2-256', 'mb-base58-btc'],
  meta = {},
}: EncodeHashlinkOptions) => {
  if (url && !urls) {
    urls = [url];
  }
  return await hlDefault.encode({ data, urls, codecs, meta });
};

export const verify = async ({
  hashlink,
  data,
  resolvers,
}: VerifyHashlinkOptions) => {
  return hlDefault.verify({ hashlink, data, resolvers });
};
