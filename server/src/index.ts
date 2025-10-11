import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import simpleGit from 'simple-git';
import path from 'path';
import { getAllFiles } from './utils/get-all-files';


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())

app.get('/ping', (_req, res) => {
  res.send('Pong');
});

app.post('/deploy', async (req, res) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).send('Repository URL is required');
  }

  const id = uuidv4();
  await simpleGit().clone(repoUrl, path.join(__dirname, `/repos/${id}`));
  const allFiles = getAllFiles(path.join(__dirname, `/repos/${id}`));

  res.send({ id, allFiles });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
    