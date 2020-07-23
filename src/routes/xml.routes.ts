import { Router } from 'express';
import aws from 'aws-sdk';

import AppError from '../errors/AppError';

const { S3_ENDPOINT = '', BUCKET_NAME = '' } = process.env;

const s3 = new aws.S3({ endpoint: S3_ENDPOINT });

const routes = Router();

routes.post('/', async (req, res) => {
    const { body, path } = req.body;

    if (!body || !path) {
        throw new AppError('Informe o body e o path');
    }

    const params = {
        Body: body,
        Bucket: BUCKET_NAME,
        Key: path,
    };
    const file = await s3.putObject(params).promise();
    return res.json({ success: !!file?.ETag });
});

routes.get('/', async (req, res) => {
    const { file } = req.query;

    if (!file) {
        throw new AppError('Acesso Negado');
    }

    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: `${file}`,
        };

        const object = await s3.getObject(params).promise();

        if (object) {
            res.contentType('application/xml');
            return res.send(object.Body);
        }
    } catch (error) {
        console.log(error.message);
        throw new AppError('Arquivo não encontrado');
    }
});

// routes.get('/lista', async (req, res) => {
//     // const bucketParams = {
//     //     Bucket: BUCKET_NAME,
//     //     Delimiter: '/',
//     //     Prefix: 'folder/',
//     // };
//     // // await s3.listObjects(bucketParams).promise();
//     // s3.listObjects(bucketParams, function (err, data) {
//     //     if (err) {
//     //         console.log('Error', err);
//     //     } else {
//     //         data.Contents.forEach(({ Key }) => {
//     //             console.log(`https://${BUCKET_NAME}.${S3_ENDPOINT}/${Key}`);
//     //         });
//     //         console.log('Success', data);
//     //     }
//     // });

//     return res.json({ ok: true });
// });

// import multer from 'multer';
// import uploadConfig from '../config/upload';
// const upload = multer(uploadConfig);
// routes.post('/', upload.single('image'), async (req, res) => {
//     const { key, size, location } = req.file;

//     const image = new Image();
//     image.filename = path.basename(key);
//     image.size = size / 1024;
//     image.url = location;

//     await image.save();

//     return res.json(image);
// });

export default routes;
