import { fecharConexao, iniciarConexao } from './index';

export async function verificarModuloFeito(idModulo: String, idUsuario: String) {
    const pool = await iniciarConexao()
    try {
        const query = 'SELECT * from modulo_feito WHERE id_modulo = $1 AND id_usuario = $2'
        const values = [idModulo, idUsuario]
        const result = await pool.query(query, values)
        fecharConexao(pool)
        return result.rowCount == 0
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
        throw error
    }
}

export async function salvarModuloFeito(idModulo: String, idUsuario: String) {
    const pool = await iniciarConexao()
    try {
        const client = await pool.connect()
        const query = 'INSERT INTO modulo_feito (id_modulo, id_usuario) VALUES ($1, $2) RETURNING *'
        const values = [idModulo, idUsuario]
        const result = await client.query(query, values)
        client.release()
        fecharConexao(pool)
        return result.rows[0]
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
        throw error
    }
}