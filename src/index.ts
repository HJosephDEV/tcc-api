// src/index.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import 'module-alias/register';
import moduleAlias from 'module-alias';
import * as path from 'path';
import router from './routes';
import { updateUserDataAndRanking } from './database/functionDB';

dotenv.config();

moduleAlias.addAlias('@', path.join(__dirname, 'src'));

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => console.log(`Server running on http://localhost:${PORT}`));

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json({limit: '1mb'}));
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use('/', router);

//300000 = 5 minutos
//60000 = 1 minutos
const intervalTime = 300000
criarIntervals()

async function updateLivesAndRanking () {
    try {
        await updateUserDataAndRanking();
        console.log('User lives and ranking updated');
    } catch (error) {
        console.error('Erro ao atualizar vidas e ranking:', error);
    } finally {
        setTimeout(updateLivesAndRanking, intervalTime);
    }
}

export function criarIntervals() {
    setTimeout(updateLivesAndRanking, intervalTime);
}