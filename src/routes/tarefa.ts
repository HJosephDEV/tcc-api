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
        try {
            const result = await getTarefas()
            res.status(201).json({message: 'Tarefas encontrado', data: result})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto pegava todas as tarefas: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.get('/tarefa', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const id = req.query['id']
            if(id == null || id == undefined) {
                res.status(403).json({message: 'Código do Tarefa não informado'})
            }
            const result = await getTarefa(id!.toString())
            if(result != undefined) {
                res.status(201).json({message: 'Tarefa encontrado', data: result})
            } else {
                res.status(404).json({message: 'Tarefa não encontrado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto pegava uma tarefa: ${error}`})
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
            res.status(201).json({message: 'Tarefa criada com sucesso', data: newTask})
        } catch(error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto criava a tarefa: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.put('/tarefa', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const tarefaAtualizado: TarefaDTO = req.body
            if(tarefaAtualizado == null || tarefaAtualizado == undefined) {
                res.status(403).json({message: 'Informações incorretas'})
                return
            }
            const result = await updateTarefa(tarefaAtualizado!.id.toString(), tarefaAtualizado)
            if(result) {
                res.status(201).json({message: 'Tarefa Atualizado'})
            } else {
                res.status(404).json({message: 'Tarefa não encontrado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto atualizava a tarefa: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.delete('/tarefa', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const id = req.query['id']
            if(id == null || id == undefined) {
                res.status(403).json({message: 'Código do tarefa não informado'})
                return
            }
            const result = await deleteTarefa(id!.toString())
            if(result) {
                res.status(201).json({message: 'Tarefa deletado'})
            } else {
                res.status(404).json({message: 'Tarefa não encontrado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto deletava a tarefa: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

function verificarTokenRequest(req: Request) {
    try {
        const token = req.header('Authorization')
        const decoded = verificarToken(token!.split(" ").at(-1)!)
        return decoded
    } catch (error) {
        console.log(error)
        return
    }
}