import UserDTO from '../dto/userDTO';
import pool from './index';
import bcrypt from 'bcrypt';

export async function getUsers() {
    const result = await pool.query('SELECT * FROM usuario')
    return result.rows
}

export async function getUser(id: string) {
    const query = 'SELECT id, nome, sobrenome, senha, login, email, user_level, user_exp, user_next_level_exp, bloqueado, vidas, id_avatar, is_admin FROM usuario WHERE id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
}

export async function getUsersByLevelAndExp() {
    const query = 'SELECT u.id as id_usuario, u.nome, u.user_level, u.user_exp, a.url FROM usuario u JOIN avatar a ON a.id = u.id_avatar ORDER BY u.user_level DESC, u.user_exp DESC LIMIT 100'
    const result = await pool.query(query)
    return result.rows
}

export async function getUsersLessThenThreeLives() {
    const query = 'SELECT id, vidas FROM usuario WHERE vidas < 3'
    const result = await pool.query(query)
    return result.rows
}

export async function createUser(user: UserDTO) {
    const query = 'INSERT INTO usuario (nome, sobrenome, login, email, senha, user_level, user_exp, user_next_level_exp, bloqueado, vidas, id_avatar, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)'+
    'RETURNING id, nome, sobrenome, login, email, user_level, user_exp, user_next_level_exp, bloqueado, vidas, id_avatar, is_admin'
    const hash = await bcrypt.hash(user.senha.toString(), 10);
    const values = [user.nome, user.sobrenome, user.login, user.email, hash, user.user_level ?? 1, user.user_exp ?? 0, user.user_next_level_exp ?? 100, user.bloqueado ?? false, user.vidas ?? 3, user.id_avatar, user.is_admin ?? false]
    const result = await pool.query(query, values)
    return result.rows[0]
}

export async function updateUser(id: string, usuarioAtualizado: UserDTO, changePassword: boolean) {
    const query = 'UPDATE usuario SET nome = $1, sobrenome = $2, login = $3, email = $4, senha = $5, user_level = $6, user_exp = $7, user_next_level_exp = $8, bloqueado = $9, vidas = $10, id_avatar = $11, is_admin = $12 WHERE id = $13'
    var hash
    if(changePassword) {
        hash = await bcrypt.hash(usuarioAtualizado.senha.toString(), 10);
    } else {
        hash = usuarioAtualizado.senha
    }
    const values = [usuarioAtualizado.nome, usuarioAtualizado.sobrenome, usuarioAtualizado.login, usuarioAtualizado.email, hash, usuarioAtualizado.user_level, usuarioAtualizado.user_exp, usuarioAtualizado.user_next_level_exp, usuarioAtualizado.bloqueado, usuarioAtualizado.vidas, usuarioAtualizado.id_avatar, usuarioAtualizado.is_admin, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function updateUserDados(id: string, usuarioAtualizado: UserDTO) {
    const query = 'UPDATE usuario SET nome = $1, sobrenome = $2, login = $3, email = $4 WHERE id = $5'
    const values = [usuarioAtualizado.nome, usuarioAtualizado.sobrenome, usuarioAtualizado.login, usuarioAtualizado.email, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function updateUserAvatar(id: string, usuarioAtualizado: UserDTO) {
    const query = 'UPDATE usuario SET id_avatar = $1 WHERE id = $2'
    const values = [usuarioAtualizado.id_avatar, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function updateUserSenha(id: string, usuarioAtualizado: UserDTO) {
    const query = 'UPDATE usuario SET senha = $1 WHERE id = $2'
    var hash = await bcrypt.hash(usuarioAtualizado.senha.toString(), 10)
    const values = [hash, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function deleteUser(id: string) {
    const query = 'DELETE FROM usuario WHERE id = $1'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function getLoginEmail(email: string){
  const query = 'SELECT id, nome, sobrenome, senha, login, email, user_level, user_exp, user_next_level_exp, bloqueado, vidas, id_avatar, is_admin FROM usuario WHERE email = $1'
  const result = await pool.query(query, [email])
  return result.rows[0]
}

export async function getLogin(login: string){
    const query = 'SELECT id, nome, sobrenome, senha, login, email, user_level, user_exp, user_next_level_exp, bloqueado, vidas, id_avatar, is_admin FROM usuario WHERE login = $1'
    const result = await pool.query(query, [login])
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
    const query = 'UPDATE usuario SET vidas = $1 WHERE id = $2'
    const values = [vidas, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}