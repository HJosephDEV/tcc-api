import express from 'express';
import { IRouter } from 'express';
import ModuloDTO from '../dto/moduloDTO';
import { getModulo, getModulos, addModulo, updateModulo, deleteModulo } from '../database/moduloDB'

const router: IRouter = express.Router();

export default router;

router.get('/modulos', async (req, res) => {
    const result = await getModulos()
    res.status(201).json({message: 'Modulos encontrado', modulos: result})
});

router.get('/modulo', async (req, res) => {
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
});

router.post('/modulo', async (req, res) => {
    const novoModulo: ModuloDTO = req.body
    try{
        const moduloAdicionado = await addModulo(novoModulo);
        res.status(201).json({message: 'Modulo criado com sucesso', modulo: moduloAdicionado})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Erro na criação de Modulo'})
    }
});

router.put('/modulo', async (req, res) => {
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
});

router.delete('/modulo', async (req, res) => {
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
});