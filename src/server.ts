import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import cors from 'cors';

import 'dotenv/config';
// import 'newrelic';

import routes from './routes';
import AppError from './errors/AppError';
import ErrorNotify from './errors/ErrorNotify';

const app = express();
app.use(express.json());
// app.use(morgan('dev'));
app.use(cors());

app.disable('x-powered-by');

app.use((req: Request, res: Response, next: NextFunction) => {
    // req.driver = driver;
    // req.aws = AWS;
    next();
});

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorNotify.notify(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    console.error(err);
    console.log(req.body);

    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('✔ Server is running');
});
