import express, { Request } from 'express';
import { IRouter } from 'express';
import UserDTO from '../dto/userDTO';
import { createUser, getUsers, getUser, updateUser, deleteUser, getLogin, blockUser, unblockUser, getLoginEmail, updateVidas } from '../database/userDB'
import { gerarToken, verificarToken } from '../middleware/auth';
import RetornoUserDTO from '../dto/retornoUserDTO';
import { getAvatar } from '../database/avatarDB';
import AvatarDTO from '../dto/avatarDTO';
import bcrypt, { hash } from 'bcrypt';

const router: IRouter = express.Router();

export default router;

router.get('/usuarios', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if (verificacao) {
        try {
            const result = await getUsers()
            res.status(201).json({message: 'Usuários encontrado', data: result})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto pegava o usuário: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.get('/usuario', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) {
        const id = req.query['id']
        if(id != undefined) {
            try {
                const result = await getUser(id!.toString())
                const avatar: AvatarDTO = await getAvatar(result.id_avatar.toString())
                result.url_avatar = avatar.url
                if(result != undefined) {
                    res.status(201).json({message: 'Usuário encontrado', data: result})
                } else {
                    res.status(403).json({message: 'Usuário não encontrado'})
                }
            } catch (error) {
                console.log(error)
                res.status(500).json({message: `Erro enquanto pegava o usuário: ${error}`})
            }
        }else {
            res.status(403).json({message: 'Código de usuário não informado'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.post('/usuario', express.json(), async (req, res) => {
    const novoUsuario: UserDTO = req.body
    try{
        const newUser: RetornoUserDTO = await createUser(novoUsuario);
        const avatar: AvatarDTO = await getAvatar(newUser.id_avatar.toString())
        newUser.url_avatar = avatar.url
        res.status(201).json({message: 'Usuario criado com sucesso', data: newUser})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: `Erro na criação de usuário: ${error}`})
    }
})

router.put('/usuario', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) {
        try {
            const updatedUser: UserDTO = req.body
            if(updatedUser != undefined){
                const result = await updateUser(updatedUser!.id.toString(), updatedUser)
                if(result) {
                    res.status(201).json({message: 'Usuário Atualizado'})
                } else {
                    res.status(403).json({message: 'Usuário não encontrado'})
                }
            } else {
                res.status(403).json({message: 'Informações incorretas'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro na atualização de usuário: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.delete('/usuario', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) {
        try {
            const id = req.query['id']
            if(id != undefined){
                const result = await deleteUser(id!.toString())
                if(result){
                    res.status(201).json({message: 'Usuário deletado'})
                }else{
                    res.status(403).json({message: 'Usuário não encontrado'})
                }
            }else {
                res.status(403).json({message: 'Código de usuário não informado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto deletava o usuário: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.post('/usuario/login', express.json(), async (req, res) => {
    const dados = req.body
    try{
        const login = dados['login'].toString() as String
        var result: UserDTO
        if(login.includes("@") == true) {
            result = await getLoginEmail(dados['login']!.toString())
        } else {
            result = await getLogin(dados['login']!.toString())
        }
        if(result == undefined) {
            res.status(403).json({message: 'Informações incorretas'})
            return
        }
        const verifSenha = await bcrypt.compare(dados['senha']!.toString(), result.senha.toString());
        if(!verifSenha) {
            res.status(401).json({message: 'Senha inválida'})
            return 
        }
        const avatar: AvatarDTO = await getAvatar(result.id_avatar.toString())
        const usuario: RetornoUserDTO = criarUsuarioRetorno(result)
        usuario.url_avatar = avatar.url
        const token = gerarToken({id: result.id})
        usuario.token = token
        res.status(201).json({message: 'Usuário logado', data: usuario})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: `Erro durante o login: ${error}`})
    }
})

router.put('/usuario/block', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) {
        try {
            const id = req.query['id']
            if(id != undefined){
                const result = await blockUser(id!.toString())
                if(result){
                    res.status(201).json({message: 'Usuário bloqueado'})
                }else{
                    res.status(403).json({message: 'Usuário já bloqueado ou não encontrado'})
                }
            }else {
                res.status(403).json({message: 'Código de usuário não informado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto bloqueava o usuário: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.put('/usuario/unblock', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) { 
        try {
            const id = req.query['id']
            if(id != undefined){
                const result = await unblockUser(id!.toString())
                if(result){
                    res.status(201).json({message: 'Usuário desbloqueado'})
                }else{
                    res.status(403).json({message: 'Usuário já desbloqueado ou não encontrado'})
                }
            }else {
                res.status(403).json({message: 'Código de usuário não informado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto desbloqueava o usuário: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.put('/usuario/restaurar-vida', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) { 
        try {
            const id = verificacao['id']
            if(id != undefined){
                const result = await updateVidas(id!.toString(), 1)
                if(result){
                    res.status(201).json({message: 'Vida restaurada'})
                }else{
                    res.status(403).json({message: 'Vida não foi restaurada'})
                }
            } else {
                res.status(403).json({message: 'Código de usuário não informado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro restauva as vidas: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

function criarUsuarioRetorno(user: UserDTO) {
    return new RetornoUserDTO(user.nome, user.sobrenome, user.login, user.email, user.user_level, user.user_exp, user.user_next_level_exp, user.bloqueado, user.vidas, user.id_avatar)
}

function verificarTokenRequest(req: Request) {
    const token = req.header('Authorization')
    const decoded = verificarToken(token!)
    return decoded
}