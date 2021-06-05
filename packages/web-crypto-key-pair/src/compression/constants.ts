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
    b = new bigInt(
      '41058363725152142129326129780047268409114441015993725554835256314039467401291'
    );
    pIdent = prime.add(1).divide(4);
  }

  if (curve === 'P-384') {
    two = new bigInt(2);
    prime = two
      .pow(384)
      .subtract(two.pow(128))
      .subtract(two.pow(96))
      .add(two.pow(32))
      .subtract(1);
    b = new bigInt(
      '27580193559959705877849011840389048093056905856361568521428707301988689241309860865136260764883745107765439761230575'
    );
    pIdent = prime.add(1).divide(4);
  }
  return { prime, b, pIdent };
};
