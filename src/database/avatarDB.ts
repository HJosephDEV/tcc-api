import AvatarDTO from '../dto/avatarDTO';
import pool from './index';

export async function getAvatars() {
    const result = await pool.query('SELECT * FROM avatar')
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