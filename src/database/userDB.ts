import UserDTO from '../dto/userDTO';
import pool from './index';

export async function getUsers() {
    const result = await pool.query('SELECT * FROM usuario')
    return result.rows
}

export async function getUser(id: string) {
    const query = 'SELECT * FROM usuario WHERE id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
}

export async function createUser(user: UserDTO) {
    const query = 'INSERT INTO usuario (nome, login, email, senha, user_level, user_exp, user_next_level_exp, bloqueado, vidas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *'
    const values = [user.nome, user.login, user.email, user.senha, user.user_level ?? 1, user.user_exp ?? 0, user.user_next_level_exp ?? 100, user.bloqueado ?? false, user.vidas ?? 3]
    const result = await pool.query(query, values)
    return result.rows[0]
}

export async function updateUser(id: string, user: UserDTO) {
    const query = 'UPDATE usuario SET nome = $1, login = $2, email = $3, senha = $4, user_level = $5, user_exp = $6, user_next_level_exp = $7, bloqueado = $8, vidas = $9 WHERE id = $10'
    const values = [user.nome, user.login, user.email, user.senha, user.user_level, user.user_exp, user.user_next_level_exp, user.bloqueado, user.vidas, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function deleteUser(id: string) {
    const query = 'DELETE FROM usuario WHERE id = $1'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function getLoginEmail(email: string, senha: string){
  const query = 'SELECT * FROM usuario WHERE email = $1 AND senha = $2'
  const result = await pool.query(query, [email, senha])
  return result.rows[0]
}

export async function getLogin(login: string, senha: string){
    const query = 'SELECT * FROM usuario WHERE login = $1 AND senha = $2'
    const result = await pool.query(query, [login, senha])
    return result.rows[0]
  }

export async function blockUser(id: String) {
    const query = 'UPDATE usuario SET bloqueado = true WHERE id = $1 and bloqueado = false'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function unblockUser(id: String) {
    const query = 'UPDATE usuario SET bloqueado = false WHERE id = $1 and bloqueado = true'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function updateVidas(id: string, vidas: number) {
    var user = await getUser(id)
    if(user.vidas < 3) {
        const query = 'UPDATE usuario SET vidas = $1 WHERE id = $2'
        const values = [user.vidas + vidas, id]
        const result = await pool.query(query, values)
        return result.rowCount > 0
    } else {
        return false
    }
    
}