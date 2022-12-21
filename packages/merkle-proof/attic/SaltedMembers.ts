import base64url from "base64url";

import {concatValues} from './concatValues';

export const getSaltedMember = (member: string, salt: string): Buffer => {
  return addSaltsToMembers(
    [base64url.toBuffer(member)],
    [base64url.toBuffer(salt)]
  )[0];
};

export const addSaltsToMembers = (members: Buffer[], salts: Buffer[]) => {
  return members.map((member, i) => {
    return concatValues([member, salts[i]]);
  });
};



