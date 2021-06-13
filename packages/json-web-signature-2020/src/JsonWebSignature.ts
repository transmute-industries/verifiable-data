import jsonld from 'jsonld';
import constants from './constants';
import { subtle } from '@transmute/web-crypto-key-pair';
import { JsonWebKeyPair } from './JsonWebKeyPair';
import jwsV1 from './contexts/jws-v1.json';

export const SUITE_CONTEXT_IRI = 'https://w3id.org/security/suites/jws-2020/v1';
export const SUITE_CONTEXT = {
  [SUITE_CONTEXT_IRI]: jwsV1,
};

const sha256 = async (data: any) => {
  return Buffer.from(await subtle.digest('SHA-256', Buffer.from(data)));
};

export interface JsonWebSignatureOptions {
  key?: JsonWebKeyPair;
  date?: any;
}

export class JsonWebSignature {
  public useNativeCanonize: boolean = false;
  public key?: JsonWebKeyPair;
  public proof: any;
  public date: any;
  public type: string = 'https://w3id.org/security#JsonWebSignature2020';
  public verificationMethod?: string;

  constructor(options: JsonWebSignatureOptions = {}) {
    this.date = options.date;
    if (options.key) {
      this.key = options.key;
      this.verificationMethod = this.key.id;
    }
  }

  async canonize(
    input: any,
    { documentLoader, expansionMap, skipExpansion }: any
  ) {
    return jsonld.canonize(input, {
      algorithm: 'URDNA2015',
      format: 'application/n-quads',
      documentLoader,
      expansionMap,
      skipExpansion,
      useNative: this.useNativeCanonize,
    });
  }

  async canonizeProof(proof: any, { documentLoader, expansionMap }: any) {
    // `jws`,`signatureValue`,`proofValue` must not be included in the proof
    // options
    proof = { ...proof };
    delete proof.jws;
    delete proof.signatureValue;
    delete proof.proofValue;
    return this.canonize(proof, {
      documentLoader,
      expansionMap,
      skipExpansion: false,
    });
  }

  async createVerifyData({
    document,
    proof,
    documentLoader,
    expansionMap,
  }: any) {
    // concatenate hash of c14n proof options and hash of c14n document
    const c14nProofOptions = await this.canonizeProof(proof, {
      documentLoader,
      expansionMap,
    });
    const c14nDocument = await this.canonize(document, {
      documentLoader,
      expansionMap,
    });
    return Buffer.concat([
      await sha256(c14nProofOptions),
      await sha256(c14nDocument),
    ]);
  }

  async matchProof({
    proof,
  }: // document,
  // purpose,
  // documentLoader,
  // expansionMap,
  any) {
    return proof.type === 'sec:JsonWebSignature2020';
  }

  async updateProof({ proof }: any) {
    // extending classes may do more
    return proof;
  }

  async sign({ verifyData, proof }: any) {
    try {
      const signer: any = await this.key?.signer();
      const detachedJws = await signer.sign({ data: verifyData });
      proof.jws = detachedJws;
      return proof;
    } catch (e) {
      console.warn('Failed to sign.');
      throw e;
    }
  }

  async createProof({
    document,
    purpose,
    documentLoader,
    expansionMap,
    compactProof,
  }: any) {
    // build proof (currently known as `signature options` in spec)
    let proof;
    if (this.proof) {
      // use proof JSON-LD document passed to API
      proof = await jsonld.compact(this.proof, constants.SECURITY_CONTEXT_URL, {
        documentLoader,
        expansionMap,
        compactToRelative: false,
      });
    } else {
      // create proof JSON-LD document
      proof = { '@context': constants.SECURITY_CONTEXT_URL };
    }

    // ensure proof type is set
    proof.type = this.type;

    // set default `now` date if not given in `proof` or `options`
    let date = this.date;
    if (proof.created === undefined && date === undefined) {
      date = new Date();
    }

    // ensure date is in string format
    if (date !== undefined && typeof date !== 'string') {
      date = new Date(date).toISOString();
    }

    // add API overrides
    if (date !== undefined) {
      proof.created = date;
    }
    // `verificationMethod` is for newer suites, `creator` for legacy
    if (this.verificationMethod !== undefined) {
      proof.verificationMethod = this.verificationMethod;
    }

    // add any extensions to proof (mostly for legacy support)
    proof = await this.updateProof({
      document,
      proof,
      purpose,
      documentLoader,
      expansionMap,
      compactProof,
    });

    // allow purpose to update the proof; the `proof` is in the
    // SECURITY_CONTEXT_URL `@context` -- therefore the `purpose` must
    // ensure any added fields are also represented in that same `@context`
    proof = await purpose.update(proof, {
      document,
      suite: this,
      documentLoader,
      expansionMap,
    });

    // create data to sign
    const verifyData = await this.createVerifyData({
      document,
      proof,
      documentLoader,
      expansionMap,
      compactProof,
    });

    // sign data
    proof = await this.sign({
      verifyData,
      document,
      proof,
      documentLoader,
      expansionMap,
    });

    return proof;
  }

  async getVerificationMethod({ proof, documentLoader }: any) {
    let { verificationMethod } = proof;

    if (!verificationMethod) {
      // backwards compatibility support for `creator`
      const { creator } = proof;
      verificationMethod = creator;
    }

    if (typeof verificationMethod === 'object') {
      verificationMethod = verificationMethod.id;
    }

    if (!verificationMethod) {
      throw new Error('No "verificationMethod" or "creator" found in proof.');
    }

    // Note: `expansionMap` is intentionally not passed; we can safely drop
    // properties here and must allow for it

    let result;

    try {
      result = await jsonld.frame(
        verificationMethod,
        {
          '@context': 'https://w3id.org/security/v2',
          '@embed': '@always',
          id: verificationMethod,
        },
        {
          documentLoader,
          compactToRelative: false,
          expandContext: 'https://w3id.org/security/v2',
        }
      );
    } catch (e) {
      console.error(e);
    }

    if (!result || !result.controller) {
      throw new Error(`Verification method ${verificationMethod} not found.`);
    }

    return result;
  }

  async verifySignature({ verifyData, verificationMethod, proof }: any) {
    // TODO: remove when we upgrade from sec/v2
    if (!verificationMethod.publicKeyJwk) {
      verificationMethod.publicKeyJwk =
        verificationMethod['sec:publicKeyJwk']['@value'];
      delete verificationMethod['sec:publicKeyJwk'];
    }
    const key = await JsonWebKeyPair.from(verificationMethod);
    const verifier = await key.verifier();
    return verifier.verify({ data: verifyData, signature: proof.jws });
  }

  async verifyProof({
    proof,
    document,
    purpose,
    documentLoader,
    expansionMap,
    compactProof,
  }: any) {
    try {
      // create data to verify
      const verifyData = await this.createVerifyData({
        document,
        proof,
        documentLoader,
        expansionMap,
        compactProof,
      });

      // fetch verification method
      const verificationMethod = await this.getVerificationMethod({
        proof,
        document,
        documentLoader,
        expansionMap,
      });

      // verify signature on data
      const verified = await this.verifySignature({
        verifyData,
        verificationMethod,
        document,
        proof,
        documentLoader,
        expansionMap,
      });
      if (!verified) {
        throw new Error('Invalid signature.');
      }

      // ensure proof was performed for a valid purpose
      const purposeResult = await purpose.validate(proof, {
        document,
        suite: this,
        verificationMethod,
        documentLoader,
        expansionMap,
      });

      if (!purposeResult.valid) {
        throw purposeResult.error;
      }

      return { verified: true, purposeResult };
    } catch (error) {
      return { verified: false, error };
    }
  }
}
