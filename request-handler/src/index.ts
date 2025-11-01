import express from "express";
import { S3 } from "aws-sdk";

const r2_endpoint: string | undefined = process.env.R2_ENDPOINT;
const r2_access_key_id: string | undefined = process.env.R2_ACCESS_KEY_ID;
const r2_secret_access_key: string | undefined = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME || "merlin";
const PORT = process.env.PORT || 3001;

const s3 = new S3({
    accessKeyId: r2_access_key_id,
    secretAccessKey: r2_secret_access_key,
    endpoint: r2_endpoint,
});

const app = express();

app.get("/ping", (_req, res) => {
    res.send("pong");
});

app.get("/*splat", async (req, res) => {
    try {
        const host = req.hostname;
        const id = host.split(".")[0];
        const filePath = req.path === "/" ? "/index.html" : req.path;

        const contents = await s3.getObject({
            Bucket: BUCKET_NAME,
            Key: `dist/${id}${filePath}`
        }).promise();
        
        let type = "application/octet-stream";
        if (filePath.endsWith(".html")) {
            type = "text/html";
        } else if (filePath.endsWith(".css")) {
            type = "text/css";
        } else if (filePath.endsWith(".js")) {
            type = "application/javascript";
        } else if (filePath.endsWith(".json")) {
            type = "application/json";
        } else if (filePath.endsWith(".png")) {
            type = "image/png";
        } else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
            type = "image/jpeg";
        } else if (filePath.endsWith(".svg")) {
            type = "image/svg+xml";
        }
        
        res.set("Content-Type", type);
        res.send(contents.Body);
    } catch (error) {
        console.error("Error serving file:", error);
        res.status(404).send("File not found");
    }
});

app.listen(PORT, () => {
    console.log(`Request handler server running on port ${PORT}`);
});