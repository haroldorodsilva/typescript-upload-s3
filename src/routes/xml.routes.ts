import { Router } from 'express';
import AppError from '../errors/AppError';

const routes = Router();

routes.post('/', async (req, res) => {
    const { content, path } = req.body;

    if (!content || !path) {
        throw new AppError('Informe o content e o path');
    }
    console.log('[key][post]', path);
    try {
        const file = await req.aws.createFile({ Body: content, Key: path });
        return res.json({ success: !!file?.ETag });
    } catch (error) {
        throw new AppError(error.message);
    }
});

routes.get('/view/:url*', async (req, res) => {
    throw new AppError('Acesso Negado');

    const url = `${req.params.url}${req.params[0]}`;

    if (!url) {
        throw new AppError('Acesso Negado');
    }

    try {
        const object = await req.aws.findFile({ Key: url });

        if (object) {
            res.contentType('application/xml');
            return res.send(object);
        }
    } catch (error) {
        throw new AppError(error.message);
    }

    throw new AppError('Arquivo não encontrado');
});

routes.post('/list', async (req, res) => {
    throw new AppError('Acesso Negado');

    const { doc, ano, modelo } = req.body;

    if (!doc || !ano || !modelo) {
        throw new AppError('Informe o Doc, Ano e Modelo.');
    }

    try {
        const object = await req.aws.listFolder({
            Key: `${doc}/${ano}/${modelo}/`,
        });

        if (object) {
            return res.json({ length: object.length, list: object });
        }
    } catch (error) {
        throw new AppError(error.message);
    }

    throw new AppError('Listagem não encontrada');
});

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
