import { S3 } from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { config } from '../config';

const s3 = new S3({
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
    endpoint: config.r2.endpoint,
});

/**
 * Upload a file to R2 storage
 * @param fileName - Name/path of the file in R2
 * @param localFilePath - Path to the file on local filesystem
 */
const uploadFile = async (fileName: string, localFilePath: string): Promise<void> => {
    const normalizedKey = fileName.split(path.sep).join('/').replace(/^\/+/, '');

    const fileContent = fs.readFileSync(localFilePath);
    await s3.upload({
        Body: fileContent,
        Bucket: config.r2.bucketName,
        Key: normalizedKey,
    }).promise();
};

export {
    uploadFile
};