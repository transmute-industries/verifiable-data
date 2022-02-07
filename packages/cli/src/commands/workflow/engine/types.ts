import { ActorFactory, Actor } from './actor';

export { ActorFactory, Actor };
export interface WorkflowEnvironment {
  services: {
    console: {
      log: (items: any) => void;
    };
    fake: {
      actor: ActorFactory;
    };
    [x: string]: unknown; // additional services specified at run time.
  };
  variables: any;
  output: any;
}
