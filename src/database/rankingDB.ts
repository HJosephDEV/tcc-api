import RankingDTO from '../dto/rankingDTO';
import pool from './index';

export async function getUsersRanking() {
    const result = await pool.query('SELECT nome, user_level, user_exp FROM ranking ORDER BY user_level DESC, user_exp DESC')
    return result.rows
}

export async function getUserRanking(id: string) {
    const query = 'SELECT * FROM ranking WHERE id_usuario = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
}

export async function createUserRanking(user: RankingDTO) {
    const query = 'INSERT INTO ranking (id_usuario, nome, user_level, user_exp) VALUES ($1, $2, $3, $4)'+
    'RETURNING *'
    const values = [user.id_usuario, user.nome, user.user_level, user.user_exp]
    const result = await pool.query(query, values)
    return result.rows[0]
}

export async function updateUserRanking(id: string, user: RankingDTO) {
    const query = 'UPDATE ranking SET nome = $1, user_level = $2, user_exp = $3 WHERE id_usuario = $4'
    const values = [user.nome, user.user_level, user.user_exp, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function deleteUserRanking(id: string) {
    const query = 'DELETE FROM ranking WHERE id = $1'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function deleteAllUsersRanking() {
    const query = 'TRUNCATE ranking'
    const result = await pool.query(query)
    return result.rowCount == 0
}
