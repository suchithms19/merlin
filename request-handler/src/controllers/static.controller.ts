import { Request, Response } from 'express';
import * as storage from '../services/storage.service';
import { getContentType, extractDeploymentId, normalizePath } from '../utils/path.utils';

const healthCheck = (_req: Request, res: Response) => {
    res.send('pong');
};

const serveFile = async (req: Request, res: Response) => {
    try {
        const id = extractDeploymentId(req.hostname);
        const filePath = normalizePath(req.path);
        const key = `dist/${id}${filePath}`;

        const contents = await storage.getObject(key);
        const contentType = getContentType(filePath);
        
        res.set('Content-Type', contentType);
        res.send(contents.Body);
    } catch (error) {
        console.error('Error serving file:', error);
        res.status(404).send('File not found');
    }
};

export {
    healthCheck,
    serveFile
};