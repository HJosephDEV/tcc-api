import express from 'express';
import { IRouter } from 'express';
import CursoDTO from '../dto/cursoDTO';
import { addCurso, getCurso, deleteCurso, updateCurso, checkUsuarioCursoExists, addInscricaoCurso, checkCursoInscrito } from '../database/cursoDB'
import CursoInscreverDTO from '../dto/cursoInscreverDTO';

const router: IRouter = express.Router();

export default router;

router.get('/curso', async (req, res) => {
    const id = req.query['id']
    if(id != undefined){
        const result = await getCurso(id!.toString())
        if(result != undefined){
            res.status(201).json({message: 'Curso encontrado', curso: result})
        }else{
            res.status(404).json({message: 'Curso não encontrado'})
        }
    }else {
        res.status(500).json({message: 'Código do curso não informado'})
    }
});

router.post('/curso', async (req, res) => {
    const newCourse: CursoDTO = req.body
    try{
        const result = await addCurso(newCourse);
        res.status(201).json({message: 'Curso criado com sucesso', curso: result})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Erro na criação de curso'})
    }
})

router.put('/curso', express.json(), async (req, res) => {
    const updatedCourse: CursoDTO = req.body
    if(updatedCourse != undefined){
        const result = await updateCurso(updatedCourse!.id.toString(), updatedCourse)
        if(result) {
            res.status(201).json({message: 'Curso Atualizado'})
        } else {
            res.status(404).json({message: 'Curso não encontrado'})
        }
    }else {
        res.status(500).json({message: 'Informações incorretas'})
    }
})

router.delete('/curso', express.json(), async (req, res) => {
    const id = req.query['id']
    if(id != undefined){
        const result = await deleteCurso(id!.toString())
        if(result){
            res.status(201).json({message: 'Curso deletado'})
        }else{
            res.status(404).json({message: 'Curso não encontrado'})
        }
    }else {
        res.status(500).json({message: 'Código do curso não informado'})
    }
})

router.post('/curso/inscrever', express.json(), async (req, res) => {
    const dados: CursoInscreverDTO = req.body
    const result = await checkUsuarioCursoExists(dados.idUsuario, dados.idCurso)
    if(result == true){
        const verifInscricao = await checkCursoInscrito(dados.idUsuario, dados.idCurso)
        if(verifInscricao == false) {
            await addInscricaoCurso(dados.idUsuario, dados.idCurso)
            res.status(201).json({message: 'Curso inscrito com sucesso'})
        } else {
            res.status(402).json({message: 'Você já inscrito no curso'})
        }
    } else {
        res.status(404).json({message: 'Usuário ou curso não encontrado'})
    }
    
})