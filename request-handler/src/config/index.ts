import dotenv from 'dotenv';
dotenv.config();

export const config = {
    r2: {
        endpoint: process.env.R2_ENDPOINT,
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        bucketName: process.env.BUCKET_NAME || 'merlin'
    },
    port: process.env.PORT || 3001
};