import RankingDTO from '../dto/rankingDTO';
import { fecharConexao, iniciarConexao } from './index';

export async function getUsersRanking() {
    const client = await iniciarConexao()
    try {
        const result = await client.query('SELECT r.nome, r.user_level, r.user_exp, a.url FROM ranking r JOIN usuario u ON u.id = r.id_usuario JOIN avatar a ON a.id = u.id_avatar ORDER BY user_level DESC, user_exp DESC')
        fecharConexao(client)
        return result.rows
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function getUserRanking(id: string) {
    const client = await iniciarConexao()
    try {
        const query = 'SELECT * FROM ranking WHERE id_usuario = $1'
        const result = await client.query(query, [id])
        fecharConexao(client)
        return result.rows[0]
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    } 
}

export async function createUserRanking(user: RankingDTO) {
    const client = await iniciarConexao()
    try {
        const query = 'INSERT INTO ranking (id_usuario, nome, user_level, user_exp) VALUES ($1, $2, $3, $4)'+
        'RETURNING *'
        const values = [user.id_usuario, user.nome, user.user_level, user.user_exp]
        const result = await client.query(query, values)
        fecharConexao(client)
        return result.rows[0]
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function updateUserRanking(id: string, user: RankingDTO) {
    const client = await iniciarConexao()
    try {
        const query = 'UPDATE ranking SET nome = $1, user_level = $2, user_exp = $3 WHERE id_usuario = $4'
        const values = [user.nome, user.user_level, user.user_exp, id]
        const result = await client.query(query, values)
        fecharConexao(client)
        return result.rowCount > 0
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function deleteUserRanking(id: string) {
    const client = await iniciarConexao()
    try {
        const query = 'DELETE FROM ranking WHERE id = $1'
        const values = [id]
        const result = await client.query(query, values)
        fecharConexao(client)
        return result.rowCount > 0
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function deleteAllUsersRanking() {
    const client = await iniciarConexao()
    try {
        const query = 'TRUNCATE ranking'
        const result = await client.query(query)
        fecharConexao(client)
        return result.rowCount == 0
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}
