import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(4000, () => {
    console.log('Request handler is running on port 4000');
});