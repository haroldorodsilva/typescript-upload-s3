import { Router } from 'express';

import xml from './xml.routes';
import certificado from './certificado.routes';
// import xmlDriveRoutes from './xml.drive.routes';

const routes = Router();
routes.get('/', async (req, res) => {
    return res.json({ status: 'UP' });
});

routes.use('/xml', xml);
routes.use('/certificado', certificado);
// routes.use('/drive', xmlDriveRoutes);

export default routes;
