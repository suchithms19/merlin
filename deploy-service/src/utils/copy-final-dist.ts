import path from "path";
import fs from "fs";
import { S3 } from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const r2_endpoint: string | undefined = process.env.R2_ENDPOINT;
const r2_access_key_id: string | undefined = process.env.R2_ACCESS_KEY_ID;
const r2_secret_access_key: string | undefined = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = "merlin"; 

const s3 = new S3({
    accessKeyId: r2_access_key_id,
    secretAccessKey: r2_secret_access_key,
    endpoint: r2_endpoint,
});

export async function copyFinalDist(id: string) {
    const folderPath = path.join(process.cwd(), 'downloads', 'repos', id, 'dist');
    const allFiles = getAllFiles(folderPath);
    const upload_promises = allFiles.map(async (file) => {
        return uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    });
    await Promise.all(upload_promises);
}

export const getAllFiles = (folderPath: string): string[] => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

export const uploadFile = async (fileName: string, localFilePath: string): Promise<void> => {
    const normalizedKey = fileName.split(path.sep).join("/").replace(/^\/+/, "");

    const fileContent = fs.readFileSync(localFilePath);
    await s3
        .upload({
            Body: fileContent,
            Bucket: BUCKET_NAME,
            Key: normalizedKey,
        }).promise();
};
