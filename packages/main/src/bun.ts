// import type { Serve } from 'bun';

import type { FunctionTrigger } from './lib';

export type FetchCallback = (request: Request, env: Record<string, unknown>) => Promise<Response> | Response;

export interface NammathamRegisterOptions {
  fetch: FetchCallback;
  func: FunctionTrigger;
}

export function register(option: NammathamRegisterOptions) {
  const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || '4000');
  console.log(`Start server on on http://localhost:${port}`);

  return {
    ...option,
    port,
  };
}
