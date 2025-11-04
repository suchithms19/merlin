import express from 'express';
import cors from 'cors';
import { config } from './config';
import * as redis from './services/redis.service';
import deploymentRoutes from './routes/deployment.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', deploymentRoutes);

app.use(errorHandler);

const startServer = async () => {
    try {
        await redis.connect();
        
        app.listen(config.port, () => {
            console.log(`Upload service is running at http://localhost:${config.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
