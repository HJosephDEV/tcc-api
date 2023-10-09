import express, { Request } from 'express';
import { IRouter } from 'express';
import UserDTO from '../dto/userDTO';
import { createUser, getUsers, getUser, updateUser, deleteUser, getLogin, blockUser, unblockUser, getLoginEmail } from '../database/userDB'
import { gerarToken, verificarToken } from '../middleware/auth';

const router: IRouter = express.Router();

export default router;

router.get('/usuarios', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        const result = await getUsers()
        res.status(201).json({message: 'Usuários encontrado', tarefas: result})
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.get('/usuario', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) {
        const id = req.query['id']
        if(id != undefined){
            const result = await getUser(id!.toString())
            if(result != undefined){
                res.status(201).json({message: 'Usuário encontrado', user: result})
            }else{
                res.status(404).json({message: 'Usuário não encontrado'})
            }
        }else {
            res.status(500).json({message: 'Código de usuário não informado'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.post('/usuario', express.json(), async (req, res) => {
    const novoUsuario: UserDTO = req.body
    try{
        const newUser = await createUser(novoUsuario);
        res.status(201).json({message: 'Usuario criado com sucesso', user: newUser})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Erro na criação de usuário'})
    }
})

router.put('/usuario', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) {
        const updatedUser: UserDTO = req.body
        if(updatedUser != undefined){
            const result = await updateUser(updatedUser!.id.toString(), updatedUser)
            if(result) {
                res.status(201).json({message: 'Usuário Atualizado'})
            } else {
                res.status(404).json({message: 'Usuário não encontrado'})
            }
        } else {
            res.status(500).json({message: 'Informações incorretas'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.delete('/usuario', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) {
        const id = req.query['id']
        if(id != undefined){
            const result = await deleteUser(id!.toString())
            if(result){
                res.status(201).json({message: 'Usuário deletado'})
            }else{
                res.status(404).json({message: 'Usuário não encontrado'})
            }
        }else {
            res.status(500).json({message: 'Código de usuário não informado'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.post('/usuario/login', express.json(), async (req, res) => {
    const dados = req.body
    try{
        const login = dados['login'].toString() as String
        var result
        if(login.includes("@") == true) {
            result = await getLoginEmail(dados['login']!.toString(), dados['senha']!.toString())
        } else {
            result = await getLogin(dados['login']!.toString(), dados['senha']!.toString())
        }
        if(result != undefined){
            const token = gerarToken({id: result.id})
            res.status(201).json({message: 'Usuário logado', token: token}) 
        } else {
            res.status(404).json({message: 'Informações incorretas'})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Erro na criação de usuário'})
    }
})

router.put('/usuario/block', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) {
        const id = req.query['id']
        if(id != undefined){
            const result = await blockUser(id!.toString())
            if(result){
                res.status(201).json({message: 'Usuário bloqueado'})
            }else{
                res.status(404).json({message: 'Usuário já bloqueado ou não encontrado'})
            }
        }else {
            res.status(500).json({message: 'Código de usuário não informado'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.put('/usuario/unblock', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) { 
        const id = req.query['id']
        if(id != undefined){
            const result = await unblockUser(id!.toString())
            if(result){
                res.status(201).json({message: 'Usuário desbloqueado'})
            }else{
                res.status(404).json({message: 'Usuário já desbloqueado ou não encontrado'})
            }
        }else {
            res.status(500).json({message: 'Código de usuário não informado'})
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