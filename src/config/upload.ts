import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import crypto from 'crypto';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

const { S3_ENDPOINT = '', BUCKET_NAME = '' } = process.env;

// const spacesEndPoint = new aws.Endpoint(S3_ENDPOINT);
const s3EndPoint = new aws.S3({ endpoint: S3_ENDPOINT });

export default {
    directory: tmpFolder,
    storage: multerS3({
        s3: s3EndPoint,
        bucket: BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, cb) {
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileDestination = `images/${fileHash}-${file.originalname}`;
            cb(null, fileDestination);
        },
    }),
};
