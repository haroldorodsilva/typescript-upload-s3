import { Router } from 'express';
import { file } from 'googleapis/build/src/apis/file';
import AppError from '../errors/AppError';

const routes = Router();
const backupFolder = 'backup_infonotas';

interface IFilePost {
    content: string;
    path: string;
}

routes.post('/', async (req, res) => {
    const { content, path } = req.body as IFilePost;

    if (!content || !path) {
        throw new AppError('Informe o content e o path');
    }

    try {
        const folders = [backupFolder, ...path.split('/')];
        const fileName = folders.pop();

        let id = await req.driver.findPath(folders);
        if (!id) {
            id = await req.driver.createPath(folders);
        }

        if (!id || !fileName) {
            throw new AppError('Sem nome do arquivo ou ID da pasta');
        }

        const newID = await req.driver.createFile(
            fileName,
            content,
            'text/xml',
            id,
        );
        return res.json({ success: !!newID });
    } catch (error) {
        throw new AppError(error.message);
    }
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
