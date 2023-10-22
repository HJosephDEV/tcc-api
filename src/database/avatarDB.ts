import AvatarDTO from '../dto/avatarDTO';
import pool from './index';

export async function getAvatarsDesbloqueados(id: string) {
    const query = 'select a.*, ((SELECT COUNT(*) FROM usuario u WHERE a.id = u.id_avatar and u.id = $1) = 1) as selecionado, ((SELECT COUNT(*) FROM usuario u WHERE u.id = $1 and a.level_req <= u.user_level) = 1) as desbloqueado from avatar a'
    const result = await pool.query(query, [id])
    return result.rows
}

export async function getAvatarsGeral() {
    const result = await pool.query('SELECT a.*, false as selecionado, (a.level_req = 0) as desbloqueado FROM avatar a')
    return result.rows
}

export async function getAvatar(id: string) {
    const query = 'SELECT * FROM avatar WHERE id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
}

export async function createAvatar(avatar: AvatarDTO) {
    const query = 'INSERT INTO avatar (url, level_req) VALUES ($1, $2) RETURNING *'
    const values = [avatar.url, avatar.level_req]
    const result = await pool.query(query, values)
    return result.rows[0]
}

export async function updateAvatar(id: string, avatar: AvatarDTO) {
    const query = 'UPDATE avatar SET url = $1, level_req = $2 WHERE id = $3'
    const values = [avatar.url, avatar.level_req, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function deleteAvatar(id: string) {
    const query = 'DELETE FROM avatar WHERE id = $1'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}