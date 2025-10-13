import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import simpleGit from 'simple-git';
import path from 'path';
import { getAllFiles } from './utils/get-all-files';
import { uploadFile } from './utils/upload-to-r2';
dotenv.config();


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())

app.get('/ping', (_req, res) => {
  res.send('Pong');
});

app.post('/deploy', async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).send('Repository URL is required');
    }

    const id = uuidv4();
    const repoPath = path.join(__dirname, `/repos/${id}`);
    
    await simpleGit().clone(repoUrl, repoPath);
    const allFiles = getAllFiles(repoPath);
    
    allFiles.forEach(async file => {
      await uploadFile(file.slice(__dirname.length + 1), file);
    })

    res.send(id);
  } catch (error) {
    console.error('Deploy error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).send('Deployment failed: ' + errorMessage);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
