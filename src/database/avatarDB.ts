import AvatarDTO from '../dto/avatarDTO';
import { fecharConexao, iniciarConexao } from './index';

export async function getAvatarsDesbloqueados(id: string) {
    const client = await iniciarConexao()
    try {
        const query = 'select a.*, ((SELECT COUNT(*) FROM usuario u WHERE a.id = u.id_avatar and u.id = $1) = 1) as selecionado, ((SELECT COUNT(*) FROM usuario u WHERE u.id = $1 and a.level_req <= u.user_level) = 1) as desbloqueado from avatar a order by a.level_req'
        const result = await client.query(query, [id])
        fecharConexao(client)
        return result.rows
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function getAvatarsGeral() {
    const client = await iniciarConexao()
    try {
        const result = await client.query('SELECT a.*, false as selecionado, (a.level_req <= 1) as desbloqueado FROM avatar a order by a.level_req')
        fecharConexao(client)
        return result.rows
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function getAvatar(id: string) {
    const client = await iniciarConexao()
    try {
        const query = 'SELECT * FROM avatar WHERE id = $1'
        const result = await client.query(query, [id])
        fecharConexao(client)
        return result.rows[0]
    } catch (error) {
        console.log(error)
        fecharConexao(client)   
    }
}

export async function createAvatar(avatar: AvatarDTO) {
    const client = await iniciarConexao()
    try {
        const query = 'INSERT INTO avatar (url, level_req) VALUES ($1, $2) RETURNING *'
        const values = [avatar.url, avatar.level_req]
        const result = await client.query(query, values)
        fecharConexao(client)
        return result.rows[0]
    } catch (error) {
        console.log(error)
        fecharConexao(client)   
    }
}

export async function updateAvatar(id: string, avatar: AvatarDTO) {
    const client = await iniciarConexao()
    try {
        const query = 'UPDATE avatar SET url = $1, level_req = $2 WHERE id = $3'
        const values = [avatar.url, avatar.level_req, id]
        const result = await client.query(query, values)
        fecharConexao(client)
        return result.rowCount > 0
    } catch (error) {
        console.log(error)
        fecharConexao(client)   
    }
}

export async function deleteAvatar(id: string) {
    const client = await iniciarConexao()
    try {
        const query = 'DELETE FROM avatar WHERE id = $1'
        const values = [id]
        const result = await client.query(query, values)
        fecharConexao(client)
        return result.rowCount > 0
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}