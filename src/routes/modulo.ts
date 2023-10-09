import express, { Request } from 'express';
import { IRouter } from 'express';
import ModuloDTO from '../dto/moduloDTO';
import { getModulo, getModulos, addModulo, updateModulo, deleteModulo } from '../database/moduloDB'
import { verificarToken } from '../middleware/auth';

const router: IRouter = express.Router();

export default router;

router.get('/modulos', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const result = await getModulos()
        res.status(201).json({message: 'Modulos encontrado', modulos: result})
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.get('/modulo', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const id = req.query['id']
        if(id != undefined){
            const result = await getModulo(id!.toString())
            if(result != undefined){
                res.status(201).json({message: 'Modulo encontrado', modulo: result})
            }else{
                res.status(404).json({message: 'Modulo não encontrado'})
            }
        }else {
            res.status(500).json({message: 'Código do Modulo não informado'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.post('/modulo', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const novoModulo: ModuloDTO = req.body
        try{
            const moduloAdicionado = await addModulo(novoModulo);
            res.status(201).json({message: 'Modulo criado com sucesso', modulo: moduloAdicionado})
        } catch(error) {
            console.log(error)
            res.status(500).json({message: 'Erro na criação de Modulo'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.put('/modulo', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const moduloAtualizado: ModuloDTO = req.body
        if(moduloAtualizado != undefined){
            const result = await updateModulo(moduloAtualizado!.id.toString(), moduloAtualizado)
            if(result) {
                res.status(201).json({message: 'Modulo Atualizado'})
            } else {
                res.status(404).json({message: 'Modulo não encontrado'})
            }
        }else {
            res.status(500).json({message: 'Informações incorretas'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.delete('/modulo', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const id = req.query['id']
        if(id != undefined){
            const result = await deleteModulo(id!.toString())
            if(result){
                res.status(201).json({message: 'Modulo deletado'})
            }else{
                res.status(404).json({message: 'Modulo não encontrado'})
            }
        }else {
            res.status(500).json({message: 'Código do modulo não informado'})
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