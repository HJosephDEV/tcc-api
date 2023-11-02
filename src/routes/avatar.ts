import express, { Request } from 'express';
import { IRouter } from 'express';
import { verificarToken } from '../middleware/auth';
import { createAvatar, getAvatar, getAvatarsGeral, getAvatarsDesbloqueados, deleteAvatar, updateAvatar } from '../database/avatarDB';
import AvatarDTO from '../dto/avatarDTO';

const router: IRouter = express.Router();

export default router;

router.get('/avatares', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    try {
        var idUser = null
        if(verificacao != undefined && verificacao != null) {
            idUser = verificacao['id']
        }
        var result
        if(idUser != undefined && idUser != null) {
            result = await getAvatarsDesbloqueados(idUser!.toString())
        } else {
            result = await getAvatarsGeral()
        }

        res.status(201).json({message: 'Avatares encontrado', data: result})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: `Erro enquanto pegava o avatar: ${error}`})
    }
});

router.get('/avatar', async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) {
        const id = req.query['id']
        if(id != undefined) {
            try {
                const result = await getAvatar(id!.toString())
                if(result != undefined){
                    res.status(201).json({message: 'Avatar encontrado', data: result})
                }else{
                    res.status(403).json({message: 'Avatar não encontrado'})
                }
            } catch(error) {
                console.log(error)
                res.status(500).json({message: `Erro enquanto pegava os avatares: ${error}`})
            }
        } else {
            res.status(403).json({message: 'Código de avatar não informado'})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
});

router.post('/avatar', express.json(), async (req, res) => {
    const novoAvatar: AvatarDTO = req.body
    try{
        const newAvatar = await createAvatar(novoAvatar);
        res.status(201).json({message: 'Avatar criado com sucesso', data: newAvatar})
    } catch(error) {
        console.log(error)
        res.status(500).json({message: `Erro na criação de avatar: ${error}`})
    }
})

router.put('/avatar', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) {
        try {
            const dadosNovos: AvatarDTO = req.body
            if(dadosNovos != undefined){
                const usuarioAntigo: AvatarDTO = await getAvatar(dadosNovos!.id.toString())
                if(usuarioAntigo == undefined || usuarioAntigo == null) {
                    res.status(404).json({message: 'Usuário não encontrado'})
                    return
                }
                const usuarioAtualizado = criarAvatarAtualizado(usuarioAntigo, dadosNovos)
                const result = await updateAvatar(dadosNovos!.id.toString(), usuarioAtualizado)
                if(result) {
                    res.status(201).json({message: 'Avatar Atualizado'})
                } else {
                    res.status(404).json({message: 'Avatar não encontrado'})
                }
            } else {
                res.status(403).json({message: 'Informações incorretas'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro na atualização de avatar: ${error}`})
        }
    } else {
        res.status(401).json({ message: 'Token inválido' })
    }
})

router.delete('/avatar', express.json(), async (req, res) => {
    const verificacao = verificarTokenRequest(req)
    if(verificacao) {
        try {
            const id = req.query['id']
            if(id != undefined){
                const result = await deleteAvatar(id!.toString())
                if(result){
                    res.status(201).json({message: 'Avatar deletado'})
                }else{
                    res.status(403).json({message: 'Avatar não encontrado'})
                }
            }else {
                res.status(403).json({message: 'Código do avatar não informado'})
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({message: `Erro enquanto deletava o avatar: ${error}`})
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

function criarAvatarAtualizado(avatarAntigo: AvatarDTO, avatarNovo: AvatarDTO) {
    const id = avatarNovo.id ?? avatarAntigo.id
    const url = avatarNovo.url ?? avatarAntigo.url
    const level_req = avatarNovo.level_req ?? avatarAntigo.level_req

    return new AvatarDTO(id, url, level_req)
}
