import { from } from "./from";
import { validate } from "./validate";
import { reveal } from "./reveal";

import { objectToUrn } from "./objectToUrn";
import { urnToObject } from "./urnToObject";

const toObject = urnToObject;
const fromObject = objectToUrn;

const MerkleUrn = { from, validate, reveal, toObject, fromObject };

export default MerkleUrn;
