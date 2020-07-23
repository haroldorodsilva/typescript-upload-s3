import { Router } from 'express';

import xmlRoutes from './xml.routes';

const routes = Router();
routes.get('/', async (req, res) => {
    return res.json({ status: 'UP' });
});

routes.use('/xml', xmlRoutes);

export default routes;
