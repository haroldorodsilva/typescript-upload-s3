import { Router } from 'express';
import AppError from '../errors/AppError';

const routes = Router();

routes.post('/', async (req, res) => {
    const { cnpj, ano, modelo, nome, content } = req.body;

    if (!content) return res.json({ success: false });

    if (!cnpj || !ano || !modelo || !nome) {
        throw new AppError('Informe todos os dados');
    }

    const { autorizados } = req.user;
    if (!autorizados.includes(cnpj)) return res.sendStatus(401);

    const path = `${cnpj}/${ano}/${modelo}/${nome}`;

    console.log('[key][post]', path);

    try {
        const file = await req.aws.createFile({ Body: content, Key: path });
        return res.json({ success: !!file?.ETag });
    } catch (error) {
        throw new AppError(error.message);
    }
});

routes.post('/view', async (req, res) => {
    const { cnpj, ano, modelo, nome } = req.body;
    /**
     * {
        "cnpj": "37509833000605",
        "ano": "2020",
        "modelo": "nfe",
        "nome": "51201137509833000605550010001774151204166302-nfe.xml"
    }    */
    if (!cnpj || !ano || !modelo || !nome) {
        throw new AppError('Informe os dados do arquivo');
    }

    const { autorizados } = req.user;
    if (!autorizados.includes(cnpj)) return res.sendStatus(401);

    const url = `${cnpj}/${ano}/${modelo}/${nome}`;

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
    const { cnpj, ano, modelo, token } = req.body;

    if (!cnpj || !ano || !modelo) {
        throw new AppError('Informe os dados');
    }

    const { autorizados } = req.user;
    if (!autorizados.includes(cnpj)) return res.sendStatus(401);

    try {
        const object = await req.aws.listFolder({
            Key: `${cnpj}/${ano}/${modelo}/`,
            token,
        });

        if (object) return res.json(object);
    } catch (error) {
        throw new AppError(error.message);
    }

    throw new AppError('Listagem não encontrada');
});

// routes.post('/view/:url*', async (req, res) => {
//     const url = `${req.params.url}${req.params[0]}`;

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
