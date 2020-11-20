import { Router } from 'express';

import authMiddleware from '../middlewares/authMiddleware';
import AuthController from '../controllers/AuthController';

import xml from './xml.routes';
import certificado from './certificado.routes';
// import xmlDriveRoutes from './xml.drive.routes';

const routes = Router();
routes.get('/', async (req, res) => {
    return res.json({ status: 'UP' });
});

routes.post('/auth', AuthController.authenticate);
routes.use('/xml', authMiddleware, xml);
routes.use('/certificado', authMiddleware, certificado);
// routes.use('/drive', authMiddleware, xmlDriveRoutes);

export default routes;
