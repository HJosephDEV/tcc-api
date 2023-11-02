import express, { Request } from 'express';
import { IRouter } from 'express';
import ModuloDTO from '../dto/moduloDTO';
import { getModulo, getModulos, addModulo, updateModulo, deleteModulo, getModulosIniciados, verificarModuloExistente } from '../database/moduloDB'
import { getTarefasConcluidasFromModule } from '../database/tarefaDB'
import { salvarModuloFeito, verificarModuloFeito } from '../database/moduloFeitoDB'
import { verificarToken } from '../middleware/auth';

const router: IRouter = express.Router();

export default router;

router.get('/modulos', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const result = await getModulos()
            res.status(201).json({message: 'Modulos encontrado', data: result})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto buscava os modulos: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.get('/modulos-iniciados', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const idUser = verificacao['id']
            const result = await getModulosIniciados(idUser)
            res.status(201).json({message: 'Modulos que foram iniciados encontrado', data: result})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto buscava os modulos: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.get('/modulo', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const id = req.query['id']
            if(id == undefined) {
                res.status(403).json({message: 'Código do Modulo não informado'})
                return
            }
            const result = await getModulo(id!.toString())
            if(result != undefined){
                res.status(201).json({message: 'Modulo encontrado', data: result})
            }else{
                res.status(404).json({message: 'Modulo não encontrado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto buscava o modulo especifico: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.post('/modulo', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try{
            const novoModulo: ModuloDTO = req.body
            const existe = await verificarModuloExistente(novoModulo.nome)
            if(existe) {
                res.status(403).json({message: 'Já possui um módulo com este nome!'})
                return
            }
            const moduloAdicionado = await addModulo(novoModulo);
            res.status(201).json({message: 'Modulo criado com sucesso', data: moduloAdicionado})
        } catch(error) {
            console.log(error)
            res.status(500).json({message: `Erro na criação de modulo: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.put('/modulo', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const moduloAtualizado: ModuloDTO = req.body
            if(moduloAtualizado == undefined) {
                res.status(403).json({message: 'Informações incorretas'})
                return
            }
            const result = await updateModulo(moduloAtualizado!.id.toString(), moduloAtualizado)
            if(result) {
                res.status(201).json({message: 'Modulo Atualizado'})
            } else {
                res.status(404).json({message: 'Modulo não encontrado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro na alteração do modulo: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.delete('/modulo', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const id = req.query['id']
            if(id == undefined) {
                res.status(403).json({message: 'Código do modulo não informado'})
                return
            }
            const result = await deleteModulo(id!.toString())
            if(result){
                res.status(201).json({message: 'Modulo deletado'})
            }else{
                res.status(404).json({message: 'Modulo não encontrado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto deleta o modulo: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.put('/modulo/verificar-conclusao', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const idUser = verificacao['id']
            const modulo = req.query['idModulo']
            if(modulo == undefined) {
                res.status(404).json({message: 'Modulo não encontrado'})
                return
            }

            const result = await getTarefasConcluidasFromModule(modulo.toString())
            const tarefasModulo = result['tarefas'] 
            const tarefasConcluida = result['tarefa_feitas']
            if(tarefasModulo != 0 && tarefasModulo == tarefasConcluida) {
                await salvarConclusaoModulo(modulo.toString(), idUser)
                res.status(201).json({message: 'Conclusão de modulo salva'})
            } else {
                res.status(201).json({message: 'Modulo incompleto'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto verificava a conclusão do modulo: ${error}`})
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

async function salvarConclusaoModulo(moduloId: String, usuarioId: String) {
    var result = await verificarModuloFeito(moduloId, usuarioId)
    if(result) {
        await salvarModuloFeito(moduloId, usuarioId)
    }
}