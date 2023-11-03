import { fecharConexao, iniciarConexao } from './index';

export async function verificarTarefaFeita(idTarefa: String, idUsuario: String) {
    const pool = await iniciarConexao()
    try {
        const query = 'SELECT * from tarefa_feita WHERE id_tarefa = $1 AND id_usuario = $2'
        const values = [idTarefa, idUsuario]
        const result = await pool.query(query, values)
        fecharConexao(pool)
        return result.rowCount == 0
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
        throw error
    }
}

export async function salvarTarefaFeita(idTarefa: String, idUsuario: String) {
    const pool = await iniciarConexao()
    try {
        const client = await pool.connect()
        const query = 'INSERT INTO tarefa_feita (id_tarefa, id_usuario) VALUES ($1, $2) RETURNING *'
        const values = [idTarefa, idUsuario]
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