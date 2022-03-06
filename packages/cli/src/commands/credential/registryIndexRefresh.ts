import path from 'path';
import {
  getAllCredentialsInDirectory,
  handleCommandResponse,
} from '../../util';

export interface RegistryConfig {
  credentials: any[];
}

export interface PublicCredentialRegistryIndex {
  count: number;
  items: string[];
}

export const buildIndex = (
  config: RegistryConfig
): PublicCredentialRegistryIndex => {
  const registryIndex: any = {};
  registryIndex.count = config.credentials.length;
  registryIndex.items = config.credentials.map(c => {
    return c.id;
  });
  return registryIndex;
};

export const registryIndexRefreshHandler = async (argv: any) => {
  if (argv.debug) {
    console.log(argv);
  }
  const credentials = await getAllCredentialsInDirectory(argv.input);
  const data = buildIndex({ credentials });
  argv.output = path.join(argv.input, 'index.json');
  handleCommandResponse(argv, data, argv.output);
};
