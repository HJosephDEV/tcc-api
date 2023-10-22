import express, { Request } from 'express';
import { IRouter } from 'express';
import RespostaDTO from '../dto/respostaDTO';
import { getResposta, getRespostas, updateResposta } from '../database/respostaDB'
import { getTarefa } from '../database/tarefaDB'
import { salvarTarefaFeita, verificarTarefaFeita } from '../database/tarefaFeitaDB'
import { getUser, updateUser, updateVidas } from '../database/userDB'
import { verificarToken } from '../middleware/auth';
import UserDTO from '../dto/userDTO';
import TarefaDTO from '../dto/tarefaDTO';

const router: IRouter = express.Router();

export default router;

router.get('/respostas', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) { 
        const id = req.query['id']
        if(id != undefined) {
            const result = await getRespostas(id!.toString())
            if(result != undefined) {
                res.status(201).json({message: 'Respostas encontradas', respostas: result})
            } else {
                res.status(404).json({message: 'Respostas não encontradas'})
            }
        } else {
            res.status(500).json({message: 'Código de tarefa não informado'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.put('/resposta', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) { 
        const updatedAnswer: RespostaDTO = req.body
        if(updatedAnswer != undefined) {
            const result = await updateResposta(updatedAnswer!.id.toString(), updatedAnswer)
            if(result) {
                res.status(201).json({message: 'Resposta Atualizada'})
            } else {
                res.status(404).json({message: 'Resposta não encontrada'})
            }
        } else {
            res.status(500).json({message: 'Informações incorretas'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.post('/resposta/enviar', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) { 
        const idResposta = req.query['idResposta']
        const idTarefa = req.query['idTarefa']
        if(idResposta == undefined || idTarefa == undefined) {
            res.status(500).json({message: 'Informações incompleta'})
            return
        }
        const idUser = verificacao['id']
        const user: UserDTO = await getUser(idUser)
        if(user.vidas <= 0) {
            res.status(500).json({message: 'Sem vidas restantes'})
            return
        }
        var resposta: RespostaDTO = await getResposta(idResposta!.toString())
        if(resposta == undefined) {
            res.status(500).json({message: 'Reposta não encontrada'})
            return
        }
        if(resposta.resposta_correta) {
            const tarefa: TarefaDTO = await getTarefa(idTarefa!.toString())
            var upouNivel = await ajustarExp(user, tarefa)
            await salvarConclusaoTarefa(tarefa.id, user.id)
            res.status(201).json({message: 'Resposta Correta', acertou: true, exp: tarefa.tarefa_exp, vidas: user.vidas, levelup: upouNivel})    
        } else {
            let vidasRestantes = user.vidas - 1
            await updateVidas(user.id.toString(), vidasRestantes)
            res.status(201).json({message: 'Resposta Incorreta', acertou: false, vidas: vidasRestantes})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

function verificarTokenRequest(req: Request) {
    const token = req.header('Authorization')
    const decoded = verificarToken(token!)
    return decoded
}

async function ajustarExp(user: UserDTO, tarefa: TarefaDTO) {
    var currentExp = user.user_exp + tarefa.tarefa_exp
    var upouNivel = false
    if(currentExp >= user.user_next_level_exp) {
        user.user_exp = currentExp - user.user_next_level_exp
        user.user_level += 1
        user.user_next_level_exp = ((user.user_next_level_exp / 2) * user.user_level)
        upouNivel = true
    } else {
        user.user_exp = currentExp
    }
    await updateUser(user.id.toString(), user)
    return upouNivel
}

async function salvarConclusaoTarefa(tarefaId: String, usuarioId: String) {
    var result = await verificarTarefaFeita(tarefaId, usuarioId)
    if(result) {
        await salvarTarefaFeita(tarefaId, usuarioId)
    }
}