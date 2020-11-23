import { IAWS } from '../backup/aws';
import { IDriver } from '../backup/driver';

interface IUserData {
    id: string;
    doc: string;
    autorizados: string[];
}

declare global {
    declare namespace Express {
        interface Request {
            user: IUserData;
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
