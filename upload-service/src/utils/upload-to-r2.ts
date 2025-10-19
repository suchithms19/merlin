import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const r2_endpoint: string | undefined = process.env.R2_ENDPOINT;
const r2_access_key_id: string | undefined = process.env.R2_ACCESS_KEY_ID;
const r2_secret_access_key: string | undefined = process.env.R2_SECRET_ACCESS_KEY;

const s3 = new S3({
    accessKeyId: r2_access_key_id,
    secretAccessKey: r2_secret_access_key,
    endpoint: r2_endpoint,
});

export const uploadFile = async (fileName: string, localFilePath: string): Promise<void> => {
    const normalizedKey = fileName.split(path.sep).join("/").replace(/^\/+/, "");

    const fileContent = fs.readFileSync(localFilePath);
    await s3
        .upload({
            Body: fileContent,
            Bucket: "merlin",
            Key: normalizedKey,
        }).promise();
};
