import express, { Request } from 'express';
import { IRouter } from 'express';
import RespostaDTO from '../dto/respostaDTO';
import { getResposta, getRespostas, updateResposta, verificaRespostaPertenceTarefa } from '../database/respostaDB'
import { getTarefa } from '../database/tarefaDB'
import { salvarTarefaFeita, verificarTarefaFeita } from '../database/tarefaFeitaDB'
import { getUser, updateUser, updateVidas } from '../database/userDB'
import { verificarToken } from '../middleware/auth';
import UserDTO from '../dto/userDTO';
import TarefaDTO from '../dto/tarefaDTO';
import RetornoStatusUserDTO from '../dto/retornoStatusUserDTO';

const router: IRouter = express.Router();

export default router;

router.get('/respostas', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) { 
        try {
            const id = req.query['id']
            if(id == null || id == undefined) {
                res.status(403).json({message: 'Código de tarefa não informado'})
                return
            }
            const result = await getRespostas(id!.toString())
            if(result != undefined) {
                res.status(201).json({message: 'Respostas encontradas', data: result})
            } else {
                res.status(404).json({message: 'Respostas não encontrada'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto pegava todas as respostas de uma tarefa: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.put('/resposta', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) { 
        try {
            const updatedAnswer: RespostaDTO = req.body
            if(updatedAnswer == null || updatedAnswer == undefined) {
                res.status(403).json({message: 'Informações incorretas'})
                return
            }
            const result = await updateResposta(updatedAnswer!.id.toString(), updatedAnswer)
            if(result) {
                res.status(201).json({message: 'Resposta Atualizada'})
            } else {
                res.status(404).json({message: 'Resposta não encontrada'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto editava uma resposta: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.post('/resposta/enviar', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) { 
        try {
            const idResposta = req.query['idResposta']
            const idTarefa = req.query['idTarefa']
            if(idResposta == undefined || idTarefa == undefined) {
                res.status(403).json({message: 'Informações incompleta'})
                return
            }
            const respostaValida = await verificaRespostaPertenceTarefa(idTarefa.toString(), idResposta.toString())
            if(respostaValida['existe'] == false) {
                res.status(403).json({message: 'Código de resposta inválido'})
                return
            }
            const idUser = verificacao['id']
            const user: UserDTO = await getUser(idUser)
            if(user.vidas <= 0) {
                res.status(403).json({message: 'Sem vidas restantes'})
                return
            }
            var resposta: RespostaDTO = await getResposta(idResposta!.toString())
            if(resposta == undefined) {
                res.status(404).json({message: 'Resposta não encontrada'})
                return
            }
            if(resposta.resposta_correta) {
                const tarefa: TarefaDTO = await getTarefa(idTarefa!.toString())
                if(tarefa == null || tarefa == undefined) {
                    res.status(404).json({message: 'Tarefa não encontrada'})
                    return
                }
                var upouNivel: RetornoStatusUserDTO = await ajustarExp(user, tarefa)
                await salvarConclusaoTarefa(tarefa.id, user.id)
                if(tarefa.tipo == 1) {
                    var descricao = tarefa.conteudo
                    resposta.descricao.split(',').forEach(it => {
                        descricao = descricao.replace("$variavel", `<span style="color:#ffe500">${it.trim()}</span>`)
                    })
                    tarefa.conteudo = descricao
                    res.status(201).json({message: 'Resposta Correta', data: {acertou: true, exp: tarefa.tarefa_exp, subiuNivel: upouNivel.subiu_nivel, user_level: upouNivel.user_level, resposta: tarefa.conteudo}})
                    return
                } else {
                    res.status(201).json({message: 'Resposta Correta', data: {acertou: true, exp: tarefa.tarefa_exp, subiuNivel: upouNivel.subiu_nivel, user_level: upouNivel.user_level}})
                    return
                }    
            } else {
                let vidasRestantes = user.vidas - 1
                await updateVidas(user.id.toString(), vidasRestantes)
                res.status(201).json({message: 'Resposta Incorreta', data: { acertou: false, vidas: vidasRestantes }})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto verificava a resposta enviada: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

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

async function ajustarExp(user: UserDTO, tarefa: TarefaDTO) {
    var currentExp = user.user_exp + tarefa.tarefa_exp
    var upouNivel = false
    if(currentExp >= user.user_next_level_exp) {
        user.user_exp = currentExp - user.user_next_level_exp
        user.user_level += 1
        user.user_next_level_exp = Math.round((user.user_next_level_exp * 1.5))
        upouNivel = true
    } else {
        user.user_exp = currentExp
    }
    await updateUser(user.id.toString(), user, false)
    const retorno = new RetornoStatusUserDTO(user.user_level, upouNivel)
    return retorno
}

async function salvarConclusaoTarefa(tarefaId: String, usuarioId: String) {
    var result = await verificarTarefaFeita(tarefaId, usuarioId)
    if(result) {
        await salvarTarefaFeita(tarefaId, usuarioId)
    }
}