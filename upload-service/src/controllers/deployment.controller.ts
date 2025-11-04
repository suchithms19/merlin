import { Request, Response } from 'express';
import * as deploymentService from '../services/deployment.service';
import { DeployRequest } from '../types';

/**
 * Deploy a new repository
 */
const deploy = async (req: Request<{}, {}, DeployRequest>, res: Response) => {
    try {
        const { repoUrl } = req.body;

        if (!repoUrl) {
            return res.status(400).send('Repository URL is required');
        }

        const id = await deploymentService.deployRepository(repoUrl);
        res.json({ id });
    } catch (error) {
        console.error('Deploy error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).send('Deployment failed: ' + errorMessage);
    }
};

/**
 * Get deployment status
 */
const getStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        if (typeof id !== 'string') {
            return res.status(400).send('Invalid ID parameter');
        }

        const status = await deploymentService.getDeploymentStatus(id);
        res.json({ status });
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).send('Status check failed');
    }
};

/**
 * Health check endpoint
 */
const healthCheck = (_req: Request, res: Response) => {
    res.send('Pong');
};

export {
    deploy,
    getStatus,
    healthCheck
};