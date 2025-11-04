import express from 'express';
import { config } from './config';
import staticRoutes from './routes/static.routes';

const app = express();

app.use('/', staticRoutes);

app.listen(config.port, () => {
    console.log(`Request handler server running on port ${config.port}`);
});