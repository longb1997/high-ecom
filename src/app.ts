import compression from 'compression';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import router from '@server/routes';
import { IErrorWithStatus } from '@server/types';

export const app = express();

//init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
//init db
import('./dbs/init.mongodb');

//init router
app.use('/', router);

//handle error
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: IErrorWithStatus = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(
  (
    error: IErrorWithStatus,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      message: error.message || 'Internal Server Error',
    });
  },
);
