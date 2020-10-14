import { IAWS } from '../backup/aws';
import { IDriver } from '../backup/driver';
import { IErrorNotify } from '../errors/ErrorNotify';

declare global {
    declare namespace Express {
        interface Request {
            driver: IDriver;
            aws: IAWS;
            errorHandler: IErrorNotify;
        }

        namespace Multer {
            interface File {
                key: string;
                size: number;
                location: string;
            }
        }
    }
}
