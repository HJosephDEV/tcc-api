import express from 'express';
import { IRouter } from 'express';
import RespostaDTO from '../dto/respostaDTO';
import { getRespostas, updateResposta } from '../database/respostaDB'

const router: IRouter = express.Router();

export default router;

router.get('/respostas', async (req, res) => {
    const id = req.query['id']
    if(id != undefined){
        const result = await getRespostas(id!.toString())
        if(result != undefined){
            res.status(201).json({message: 'Respostas encontradas', respostas: result})
        }else{
            res.status(404).json({message: 'Respostas não encontradas'})
        }
    }else {
        res.status(500).json({message: 'Código de tarefa não informado'})
    }
});

router.put('/resposta', express.json(), async (req, res) => {
    const updatedAnswer: RespostaDTO = req.body
    if(updatedAnswer != undefined){
        const result = await updateResposta(updatedAnswer!.id.toString(), updatedAnswer)
        if(result) {
            res.status(201).json({message: 'Resposta Atualizada'})
        } else {
            res.status(404).json({message: 'Resposta não encontrada'})
        }
    }else {
        res.status(500).json({message: 'Informações incorretas'})
    }
})
