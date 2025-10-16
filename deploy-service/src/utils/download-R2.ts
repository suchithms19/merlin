import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";
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

export async function downloadS3Folder(prefix: string) {
    try {
        const allFiles = await s3.listObjectsV2({
            Bucket: BUCKET_NAME,
            Prefix: prefix
        }).promise();
        

        if (!allFiles.Contents || allFiles.Contents.length === 0) {
            console.log(`No files found with prefix: ${prefix}`);
            return;
        }

        const allPromises = allFiles.Contents.map(async ({Key}) => {
            if (!Key) {
                console.log("Skipping undefined key");
                return;
            }

            return new Promise((resolve, reject) => {
                const finalOutputPath = path.join(process.cwd(), 'downloads', Key);
                const dirName = path.dirname(finalOutputPath);

                fs.mkdirSync(dirName, { recursive: true });

                const outputFile = fs.createWriteStream(finalOutputPath);
                
                console.log(`Downloading: ${Key} to ${finalOutputPath}`);

                s3.getObject({
                    Bucket: BUCKET_NAME,
                    Key
                }).createReadStream()
                  .pipe(outputFile)
                  .on("finish", () => {
                      console.log(`Downloaded: ${Key}`);
                      resolve(Key);
                  })
                  .on("error", (err) => {
                      console.error(`Error downloading ${Key}:`, err);
                      reject(err);
                  });
            });
        });

        console.log("Starting downloads...");
        await Promise.all(allPromises);
        console.log("All downloads completed");
    } catch (error) {
        console.error("Download error:", error);
        throw error;
    }
}