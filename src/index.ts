// src/index.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import 'module-alias/register';
import moduleAlias from 'module-alias';
import * as path from 'path';
import router from './routes';

dotenv.config();
moduleAlias.addAlias('@', path.join(__dirname, 'src'));

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => console.log(`Server running on http://localhost:${PORT}`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use('/', router);
