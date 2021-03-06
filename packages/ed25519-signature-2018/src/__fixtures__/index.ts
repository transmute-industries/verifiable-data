import { documentLoader } from './documentLoader';

import credential_fixtures from './credential.json';
import keypair_fixtures from './keypair.json';
import issuer_fixtures from './issuer.json';

const vc_template_0 = credential_fixtures.vc_template_0 as any;
const vc_0 = credential_fixtures.vc_0 as any;
const vp_0 = credential_fixtures.vp_0 as any;

const keypair_0 = keypair_fixtures.keypair_0 as any;
const issuer_0 = issuer_fixtures.issuer_0 as any;

export { keypair_0, issuer_0, vc_template_0, vc_0, vp_0, documentLoader };
