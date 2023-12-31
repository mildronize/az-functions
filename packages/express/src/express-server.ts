import express from 'express';
import { createExpressMiddleware } from './middleware';
import { BaseHandlerResolver, NammathamApp, logger } from '@nammatham/core';
import { NammathamHttpHandlerOption } from './types';

export interface ExpressServerOption {
  port?: number;
  expressApp?: express.Express;
  isDevelopment?: boolean;
}

/**
 * Express Server Plugin
 */
export function expressServer(option?: ExpressServerOption) {
  return (app: NammathamApp, handlerResolver: BaseHandlerResolver) => {
    const isDevelopment = option?.isDevelopment ?? process.env.NODE_ENV === 'development';
    if (!isDevelopment) {
      logger.debug('Skipping express server in development mode');
      return;
    }
    logger.info(`Using plugin: expressServer`);
    startExpress(
      {
        handlerResolver,
        app,
      },
      option
    );
  };
}

export function startExpress({ app, handlerResolver }: NammathamHttpHandlerOption, devOption?: ExpressServerOption) {
  logger.debug('Starting express server');
  const expressApp = devOption?.expressApp ?? express();
  const port = devOption?.port ?? 3000;

  // https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
  expressApp.disable('etag');
  expressApp.use(
    '/api',
    createExpressMiddleware({
      app,
      handlerResolver,
      // createContext,
    })
  );

  expressApp.listen(port, async () => {
    logger.info(`Dev Server started at http://localhost:${port}`);
    await handlerResolver.afterServerStarted(app, { port });
  });
}
