import pool from './index';

export async function verificarModuloFeito(idModulo: String, idUsuario: String) {
    const query = 'SELECT * from modulo_feito WHERE id_modulo = $1 AND id_usuario = $2'
    const values = [idModulo, idUsuario]
    const result = await pool.query(query, values)
    return result.rowCount == 0
}

export async function salvarModuloFeito(idModulo: String, idUsuario: String) {
    const query = 'INSERT INTO modulo_feito (id_modulo, id_usuario) VALUES ($1, $2) RETURNING *'
    const values = [idModulo, idUsuario]
    const result = await pool.query(query, values)
    return result.rows[0]
}