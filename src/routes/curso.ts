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
        try {
            const id = req.query['id']
            if(id == null || id == undefined) {
                res.status(403).json({message: 'Código do curso não informado'})
                return
            }
            const result = await getCurso(id!.toString())
            if(result == null || result == undefined) {
                res.status(404).json({message: 'Curso não encontrado'})
                return
            }

            res.status(201).json({message: 'Curso encontrado', data: result})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto atualizava um curso: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.post('/curso', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const newCourse: CursoDTO = req.body
        try {
            const result = await addCurso(newCourse);
            res.status(201).json({message: 'Curso criado com sucesso', data: result})
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
        try {
            const updatedCourse: CursoDTO = req.body
            if(updatedCourse == null || updatedCourse == undefined) {
                res.status(403).json({message: 'Informações incorretas'})
                return
            }
            const result = await updateCurso(updatedCourse!.id.toString(), updatedCourse)
            if(result) {
                res.status(201).json({message: 'Curso Atualizado'})
            } else {
                res.status(404).json({message: 'Curso não encontrado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto atualizava um curso: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.delete('/curso', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const id = req.query['id']
            if(id == null || id == undefined) {
                res.status(403).json({message: 'Código do curso não informado'})
                return
            }
            const result = await deleteCurso(id!.toString())
            if(result) {
                res.status(201).json({message: 'Curso deletado'})
            } else {
                res.status(404).json({message: 'Curso não encontrado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto deletava um curso: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.post('/curso/inscrever', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const idUser = verificacao['id']
            const idCurso = req.query['idCurso']?.toString()
            const result = await checkUsuarioCursoExists(idUser, idCurso!)
            if(result == false) {
                res.status(404).json({message: 'Usuário ou curso não encontrado'})
                return
            }

            const verifInscricao = await checkCursoInscrito(idUser, idCurso!)
            if(verifInscricao == false) {
                await addInscricaoCurso(idUser, idCurso!)
                res.status(201).json({message: 'Curso inscrito com sucesso'})
            } else {
                res.status(403).json({message: 'Você já inscrito no curso'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro durante a inscrição do curso: ${error}`})
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