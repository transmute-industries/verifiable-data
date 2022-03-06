import * as api from './createDocument';

it('can create did web', async () => {
  const githubConfig: api.GitHubDidWebConfig = {
    username: 'OR13',
    repository: 'public-credential-registry-template',
    mnemonic:
      'sell antenna drama rule twenty cement mad deliver you push derive hybrid',
    hdpath: `m/44'/0'/0'/0/0`,
    type: 'ed25519',
  };
  const doc = await api.createDocument(githubConfig);
  expect(doc.id).toBe(
    'did:web:or13.github.io:public-credential-registry-template:issuers:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn'
  );
});
