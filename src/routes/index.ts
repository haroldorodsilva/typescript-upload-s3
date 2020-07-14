import { Router } from 'express';

import fileRoutes from './file.routes';

const routes = Router();

routes.use('/files', fileRoutes);

export default routes;
