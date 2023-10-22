import pool from './index';

export async function verificarTarefaFeita(idTarefa: String, idUsuario: String) {
    const query = 'SELECT * from tarefa_feita WHERE id_tarefa = $1 AND id_usuario = $2'
    const values = [idTarefa, idUsuario]
    const result = await pool.query(query, values)
    return result.rowCount == 0
}

export async function salvarTarefaFeita(idTarefa: String, idUsuario: String) {
    const query = 'INSERT INTO tarefa_feita (id_tarefa, id_usuario) VALUES ($1, $2) RETURNING *'
    const values = [idTarefa, idUsuario]
    const result = await pool.query(query, values)
    return result.rows[0]
}