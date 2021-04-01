/**
 * defines the ability to sign based on a KeyPair or only
 * from a private key
 */
interface Signer {
    privateKey: any;
    keyPair?: KeyPair;
    sign(options: {
        data: any;
    }): string;
}

/**
 * defines the ability to perform verification based on a KeyPair
 * or a public key
 */
interface Verifier {
    publicKey: any;
    keyPair?: KeyPair;
    verify(options: {
        data: any;
        signature: string;
    }): boolean;
}

/**
 * public key side of a key pair
 */
interface PublicNode {
    id: string;
    type: any;
    controller?: any;
    publicKey: any;
}
/**
 * private key side of a key pair
 */
 interface PrivateNode {
    id: string;
    type: any;
    controller?: any;
    privateKey: any;
}

/**
 * defines the common properties and methoods in use by 
 * key pairs in the LD realm based on existing implementations
 */
interface KeyPair {
    id: string;
    type: any;
    controller?: any;
    publicKey: any;
    privateKey: any;
    
    /**
     * exports a key, with or without private key material, in specified or default format
     * @param options 
     */
    export(options: {
        exportPrivate: boolean;
        keyType?: string;
    }): any;

    generate(options: any): KeyPair;

    fingerprint(): string;
    verifyFingerprint(options: {
        fingerprint: string
    }): boolean;
    fromFingerprint(options: {
        fingerprint: string
    }): KeyPair;
    fingerprintFromPublicKey(options: {
        publicKey: any;
        publicKeyType: string;
    }): string;
    
    signer(): Signer;
    verifier(): Verifier;
}

/**
 * allows for the general grouping of a list of key pairs that are
 * related in some fashion
 */
interface KeyPairs {
    id: string;
    type: any;
    controller?: any;
    pairs: KeyPair[];
    
    /**
     * should call generate for each key pair based on type and len of pairs[]
     * @param options 
     */
    generate(options: any): KeyPairDouble;
    export(options: {
        exportPrivate: boolean;
    }): any;
}

/**
 * allows for ordered and consistent pair of Key Pairs for use
 * with items such as pairing friendly keys, etc.
 */
interface KeyPairDouble {
    id: string;
    type: any;
    controller?: any;
    keyOne: KeyPair;
    keyTwo: KeyPair;
    /**
     * should call generate for each key pair based on type
     * @param options 
     */
    generate(options: any): KeyPairDouble;
    fingerprint(): string;
    fromFingerprint(options: {
        fingerprint: string
    }): KeyPair;
    export(options: {
        exportPrivate: boolean;
    }): any;
}

export { KeyPair, KeyPairDouble, KeyPairs, Signer, Verifier };