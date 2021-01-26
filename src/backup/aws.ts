import aws from 'aws-sdk';

interface IAWSCreateFile {
    Body: string;
    Key: string;
    Bucket?: string;
}

interface IAWSFindFile {
    Key: string;
    Bucket?: string;
    marker?: string;
}

interface IAWSListFolder {
    length: number;
    list: string[];
    marker: string;
}

export interface IAWS {
    createFile(data: IAWSCreateFile): Promise<aws.S3.PutObjectOutput>;
    findFile(data: IAWSFindFile): Promise<string>;
    listFolder(data: IAWSFindFile): Promise<IAWSListFolder>;
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

    listFolder = async (data: IAWSFindFile): Promise<IAWSListFolder> => {
        const params = {
            Delimiter: '/',
            Prefix: data.Key,
            Bucket: data.Bucket ? data.Bucket : this.BUCKET_NAME,
            MaxKeys: 5000,
            Marker: data.marker || '',
        };
        const list: string[] = [];

        const object = await this.s3.listObjects(params).promise();
        if (object.Contents) {
            object.Contents.map(({ Key }) => {
                if (Key) {
                    const name = String(Key.split('/')[3]);
                    if (name) list.push(name);
                }
                return '';
            });
        }

        params.Marker = object.NextMarker || '';

        return { length: list.length, list, marker: params.Marker };
    };
}

export default new AWS();
