import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
// import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import 'dotenv/config';
import 'newrelic';

import { AWS } from './backup';
import routes from './routes';
import AppError from './errors/AppError';
import ErrorNotify from './errors/ErrorNotify';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '10MB' }));

app.use(helmet());
// app.use(morgan('dev'));
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
    // req.driver = driver;
    req.aws = AWS;
    next();
});

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    ErrorNotify.notify(err);
    console.error(err);

    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('✔ Server is running');
});
