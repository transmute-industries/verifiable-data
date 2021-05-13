const allowed = [
  'id',
  'type',
  'controller',
  'name',
  'description',
  'image',
  'publicKeyJwk',
  'publicKeyBase58',
  '@context', // credential
  'proof',
  'issuanceDate',
  'issuer',
  'relatedLink',
  'credentialStatus',
  'credentialSubject',
  'expirationDate',
  'receiver', // presentation submission
  'sender',
  'status',
  'verifiablePresentation',
];

export const onlyPlaintextExportable = (item: any) => {
  const safeItem: any = {};
  for (const k of Object.keys(item)) {
    if (allowed.includes(k)) {
      safeItem[k] = item[k];
    }
  }
  return safeItem;
};
