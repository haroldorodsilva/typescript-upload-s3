import { IDriver } from '../backup/driver';

declare global {
    declare namespace Express {
        interface Request {
            driver: IDriver;
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
