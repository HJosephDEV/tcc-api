import express, { Request } from 'express';
import { IRouter } from 'express';
import CursoDTO from '../dto/cursoDTO';
import { addCurso, getCurso, deleteCurso, updateCurso, checkUsuarioCursoExists, addInscricaoCurso, checkCursoInscrito } from '../database/cursoDB'
import { verificarToken } from '../middleware/auth';

const router: IRouter = express.Router();

export default router;

router.get('/curso', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
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
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.post('/curso', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const newCourse: CursoDTO = req.body
        try{
            const result = await addCurso(newCourse);
            res.status(201).json({message: 'Curso criado com sucesso', curso: result})
        } catch(error) {
            console.log(error)
            res.status(500).json({message: 'Erro na criação de curso'})
        }   
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.put('/curso', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
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
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.delete('/curso', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
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
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.post('/curso/inscrever', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const idUser = verificacao['id']
        const idCurso = req.query['idCurso']?.toString()
        const result = await checkUsuarioCursoExists(idUser, idCurso!)
        if(result == true){
            const verifInscricao = await checkCursoInscrito(idUser, idCurso!)
            if(verifInscricao == false) {
                await addInscricaoCurso(idUser, idCurso!)
                res.status(201).json({message: 'Curso inscrito com sucesso'})
            } else {
                res.status(402).json({message: 'Você já inscrito no curso'})
            }
        } else {
            res.status(404).json({message: 'Usuário ou curso não encontrado'})
        }   
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

function verificarTokenRequest(req: Request) {
    const token = req.header('Authorization')
    const decoded = verificarToken(token!.split(" ").at(-1)!)
    return decoded
}