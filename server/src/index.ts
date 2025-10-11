import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())

app.get('/ping', (_req, res) => {
  res.send('Pong');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
    