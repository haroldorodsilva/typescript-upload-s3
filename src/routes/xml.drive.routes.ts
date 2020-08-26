import { Router } from 'express';
import { google } from 'googleapis';
import AppError from '../errors/AppError';

const { DRIVE_CLIENT_ID = '', DRIVE_CLIENT_SECRET = '' } = process.env;
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

const routes = Router();

routes.post('/', async (req, res) => {
    return false;
    // const { content, path } = req.body;

    // if (!content || !path) {
    //     throw new AppError('Informe o content e o path');
    // }

    // const params = {
    //     Body: content,
    //     Bucket: BUCKET_NAME,
    //     Key: path,
    // };
    // try {
    //     const file = await s3.putObject(params).promise();
    //     return res.json({ success: !!file?.ETag });
    // } catch (error) {
    //     throw new AppError(error.message);
    // }
});

routes.get('/:url*', async (req, res) => {
    const url = `${req.params.url}${req.params[0]}`;
    // return url;

    // if (!url) {
    //     throw new AppError('Acesso Negado');
    // }

    // try {
    //     const params = {
    //         Bucket: BUCKET_NAME,
    //         Key: url,
    //     };

    //     const object = await s3.getObject(params).promise();

    //     if (object) {
    //         res.contentType('application/xml');
    //         return res.send(object.Body);
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
    // throw new AppError('Arquivo não encontrado');
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
