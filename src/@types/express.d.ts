import { IAWS } from '../backup/aws';
import { IDriver } from '../backup/driver';

declare global {
    declare namespace Express {
        interface Request {
            userId: string;
            driver: IDriver;
            aws: IAWS;
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
