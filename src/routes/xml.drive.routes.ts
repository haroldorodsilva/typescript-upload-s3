import { Router } from 'express';
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

export default routes;
