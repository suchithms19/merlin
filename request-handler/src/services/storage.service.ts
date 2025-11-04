import { S3 } from 'aws-sdk';
import { config } from '../config';

const s3 = new S3({
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
    endpoint: config.r2.endpoint,
});

const getObject = async (key: string) => {
    return await s3.getObject({
        Bucket: config.r2.bucketName,
        Key: key
    }).promise();
};

export {
    getObject
};