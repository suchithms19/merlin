import simpleGit from 'simple-git';
import path from 'path';
import { getAllFiles } from '../utils/get-all-files';
import { uploadFile } from './storage.service';
import * as redis from './redis.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Deploy a repository from a given URL
 * @param repoUrl - URL of the repository to deploy
 * @returns Deployment ID
 */
const deployRepository = async (repoUrl: string): Promise<string> => {
    const id = uuidv4();
    const repoPath = path.join(process.cwd(), `/repos/${id}`);
    
    try {
        await redis.setStatus(id, 'uploading');

        await simpleGit().clone(repoUrl, repoPath);
        
        const allFiles = getAllFiles(repoPath);
        const uploadPromises = allFiles.map((file) => {
            const relativeInRepo = path.relative(repoPath, file);
            const r2Key = path.join('repos', id, relativeInRepo);
            return uploadFile(r2Key, file);
        });
        await Promise.all(uploadPromises);

        await redis.addToBuildQueue(id);
        await redis.setStatus(id, 'building');

        return id;
    } catch (error) {
        await redis.setStatus(id, 'failed');
        throw error;
    }
};

/**
 * Get the current status of a deployment
 * @param id - Deployment ID
 * @returns Current deployment status
 */
const getDeploymentStatus = async (id: string): Promise<string | null> => {
    return await redis.getStatus(id);
};

export {
    deployRepository,
    getDeploymentStatus
};