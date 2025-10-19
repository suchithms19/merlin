import express from "express";
import { S3 } from "aws-sdk";

const r2_endpoint: string | undefined = process.env.R2_ENDPOINT;
const r2_access_key_id: string | undefined = process.env.R2_ACCESS_KEY_ID;
const r2_secret_access_key: string | undefined = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = "merlin"; 

const s3 = new S3({
    accessKeyId: r2_access_key_id,
    secretAccessKey: r2_secret_access_key,
    endpoint: r2_endpoint,
});

const app = express();

app.get("/*", async (req, res) => {
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: BUCKET_NAME,
        Key: `dist/${id}${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);
    res.send(contents.Body);
})

app.listen(4000);