import * as bip39 from 'bip39';
import * as hdkey from 'hdkey';

import { generateKey } from './generateKey';

export const deriveKey = async (
  type: string,
  mnemonic: string,
  hdpath: string
) => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = hdkey.fromMasterSeed(seed);
  const addrNode = root.derive(hdpath);
  return await generateKey({
    type: type,
    seed: addrNode._privateKey,
  });
};
