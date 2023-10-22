import express, { Request } from 'express';
import { IRouter } from 'express';
import TarefaDTO from '../dto/tarefaDTO';
import { getTarefas, getTarefa, addTarefa, deleteTarefa, updateTarefa } from '../database/tarefaDB'
import { addResposta } from '../database/respostaDB'
import RespostaDTO from '../dto/respostaDTO';
import { verificarToken } from '../middleware/auth';

const router: IRouter = express.Router();

export default router;

router.get('/tarefas', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const result = await getTarefas()
        res.status(201).json({message: 'Tarefas encontrado', tarefas: result})
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.get('/tarefa', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const id = req.query['id']
        if(id != undefined) {
            const result = await getTarefa(id!.toString())
            if(result != undefined) {
                res.status(201).json({message: 'Tarefa encontrado', tarefa: result})
            } else {
                res.status(404).json({message: 'Tarefa não encontrado'})
            }
        } else {
            res.status(500).json({message: 'Código do Tarefa não informado'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.post('/tarefa', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const novaTarefa: TarefaDTO = req.body
        try{
            const newTask: TarefaDTO = await addTarefa(novaTarefa);
            var respostas: RespostaDTO[] = []
            for (const resposta of novaTarefa.respostas) {
                var result: RespostaDTO = await addResposta(resposta, newTask.id)
                respostas.push(result)
            }
            newTask.respostas = respostas
            res.status(201).json({message: 'Tarefa criada com sucesso', task: newTask})
        } catch(error) {
            console.log(error)
            res.status(500).json({message: 'Erro na criação de tarefa'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.put('/tarefa', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const tarefaAtualizado: TarefaDTO = req.body
        if(tarefaAtualizado != undefined){
            const result = await updateTarefa(tarefaAtualizado!.id.toString(), tarefaAtualizado)
            if(result) {
                res.status(201).json({message: 'Tarefa Atualizado'})
            } else {
                res.status(403).json({message: 'Tarefa não encontrado'})
            }
        }else {
            res.status(403).json({message: 'Informações incorretas'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.delete('/tarefa', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const id = req.query['id']
        if(id != undefined){
            const result = await deleteTarefa(id!.toString())
            if(result){
                res.status(201).json({message: 'Tarefa deletado'})
            }else{
                res.status(403).json({message: 'Tarefa não encontrado'})
            }
        } else {
            res.status(403).json({message: 'Código do tarefa não informado'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

function verificarTokenRequest(req: Request) {
    const token = req.header('Authorization')
    const decoded = verificarToken(token!)
    return decoded
}