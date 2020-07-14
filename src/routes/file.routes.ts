import { Router } from 'express';
import multer from 'multer';
import path from 'path';

import uploadConfig from '../config/upload';

import Image from '../models/Image';

const routes = Router();
const upload = multer(uploadConfig);

routes.post('/', upload.single('image'), async (req, res) => {
    const { key, size, location } = req.file;

    const image = new Image();
    image.filename = path.basename(key);
    image.size = size / 1024;
    image.url = location;

    await image.save();

    return res.json(image);
});

routes.get('/', async (req, res) => {
    const images = await Image.find();
    return res.json(images);
});

export default routes;
