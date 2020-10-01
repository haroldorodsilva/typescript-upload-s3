import { Router } from 'express';

import xmlRoutes from './xml.routes';
import xmlDriveRoutes from './xml.drive.routes';

const routes = Router();
routes.get('/', async (req, res) => {
    return res.json({ status: 'UP' });
});

routes.get('/fala', async (req, res) => {
    return res.json({ ocara: 'marcelino' });
});

// routes.use('/xml', xmlRoutes);
routes.use('/xml', xmlDriveRoutes);

export default routes;
