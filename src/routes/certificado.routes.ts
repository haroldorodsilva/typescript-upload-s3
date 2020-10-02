import { Router } from 'express';
import AppError from '../errors/AppError';

const routes = Router();

const Bucket = 'certificado-infonotas';

routes.post('/', async (req, res) => {
    const { content, path } = req.body;

    if (!content || !path) {
        throw new AppError('Informe o content e o path');
    }

    try {
        const file = await req.aws.createFile({
            Body: content,
            Key: path,
            Bucket,
        });

        return res.json({ success: !!file?.ETag });
    } catch (error) {
        throw new AppError(error.message);
    }
});

routes.get('/:url*', async (req, res) => {
    const url = `${req.params.url}${req.params[0]}`;

    if (!url) {
        throw new AppError('Acesso Negado');
    }

    try {
        const object = await req.aws.findFile({ Key: url, Bucket });

        if (object) {
            res.contentType('application/xml');
            return res.send(object);
        }
    } catch (error) {
        console.log(error);
    }

    throw new AppError('Arquivo não encontrado');
});

export default routes;
