// This file is kept as a reference, not used.

import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

export const setupApp = (app) => {
  app.use(
    session({
      secret: 'somesecretkey',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
};
