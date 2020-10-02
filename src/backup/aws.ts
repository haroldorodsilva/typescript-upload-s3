import aws from 'aws-sdk';
import AppError from '../errors/AppError';

interface IAWSCreateFile {
    Body: string;
    Key: string;
    Bucket?: string;
}

interface IAWSFindFile {
    Key: string;
    Bucket?: string;
}

export interface IAWS {
    createFile(data: IAWSCreateFile): Promise<aws.S3.PutObjectOutput>;
    findFile(data: IAWSFindFile): Promise<string>;
}

class AWS implements IAWS {
    private s3: aws.S3;

    private BUCKET_NAME: string;

    constructor() {
        const S3_ENDPOINT = process.env.S3_ENDPOINT || '';
        this.BUCKET_NAME = process.env.BUCKET_NAME || '';

        this.s3 = new aws.S3(
            S3_ENDPOINT ? { endpoint: S3_ENDPOINT } : undefined,
        );
    }

    createFile = async (
        data: IAWSCreateFile,
    ): Promise<aws.S3.PutObjectOutput> => {
        const params = {
            Bucket: data.Bucket ? data.Bucket : this.BUCKET_NAME,
            ...data,
        };

        return this.s3.putObject(params).promise();
    };

    findFile = async (data: IAWSFindFile): Promise<string> => {
        const params = {
            Bucket: data.Bucket ? data.Bucket : this.BUCKET_NAME,
            ...data,
        };

        const object = await this.s3.getObject(params).promise();

        if (object.Body) {
            return object.Body as string;
        }

        return '';
    };
}

export default new AWS();
