/**
 * defines the ability to sign based on a KeyPair or only
 * from a private key
 */
interface Signer {
    privateKey: string;
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
    publicKey: string;
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
    publicKey?: string;
    publicKeyBase58?: string;
}
/**
 * public key side of a key pair
 */
 interface PrivateNode {
    id: string;
    type: any;
    controller?: any;
    privateKey?: string;
    privateKeyBase58?: string;
}

/**
 * defines the common properties and methoods in use by 
 * key pairs in the LD realm based on existing implementations
 */
interface KeyPair {
    id: string;
    type: any;
    controller?: any;
    publicKey?: string;
    privateKey?: string;
    publicKeyBase58?: string;
    privateKeyBase58?: string;
    publicNode(): PublicNode;
    generate(options: any): KeyPair;
    fingerprint(): string;
    verifyFingerprint(options: {
        fingerprint: string
    }): boolean;
    fromFingerprint(options: {
        fingerprint: string
    }): KeyPair;
    fingerprintFromPublicKey(options: {
        publicKeyBase58: string
    }): string;
    signer(): Signer;
    verifier(): Verifier;
}

/**
 * allows forthe general grouping of a list of key pairs that are
 * related in some fashion
 */
interface KeyPairs {
    id: string;
    type: any;
    controller?: any;
    pairs?: KeyPair[];
}

/**
 * allows for ordered and consistent pair of Key Pairs for use
 * with items such as pairing friendly keys, etc.
 */
interface KeyPairDouble {
    id: string;
    type: any;
    controller?: any;
    keyOne?: KeyPair;
    keyTwo?: KeyPair;
    /**
     * should call generate for each key pair based on type
     * @param options 
     */
    generate(options: any): KeyPairDouble;
}

export { KeyPair, KeyPairDouble, KeyPairs, Signer, Verifier };