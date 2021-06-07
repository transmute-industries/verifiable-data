import bigInt from 'big-integer';

export const getConstantsForCurve = (curve: string) => {
  let two, prime, b, pIdent;

  if (curve === 'P-256') {
    two = new bigInt(2);
    prime = two
      .pow(256)
      .subtract(two.pow(224))
      .add(two.pow(192))
      .add(two.pow(96))
      .subtract(1);

    pIdent = prime.add(1).divide(4);

    b = new bigInt(
      '5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
      16
    );
  }

  if (curve === 'P-384') {
    two = new bigInt(2);
    prime = two
      .pow(384)
      .subtract(two.pow(128))
      .subtract(two.pow(96))
      .add(two.pow(32))
      .subtract(1);

    pIdent = prime.add(1).divide(4);
    b = new bigInt(
      'b3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef',
      16
    );
  }

  if (curve === 'P-521') {
    two = new bigInt(2);
    prime = two.pow(521).subtract(1);
    b = new bigInt(
      '00000051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00',
      16
    );
    pIdent = prime.add(1).divide(4);
  }
  return { prime, b, pIdent };
};
