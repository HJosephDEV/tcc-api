import { fecharConexao, iniciarConexao } from './index';

export async function verificarTarefaFeita(idTarefa: String, idUsuario: String) {
    const client = await iniciarConexao()
    const query = 'SELECT * from tarefa_feita WHERE id_tarefa = $1 AND id_usuario = $2'
    const values = [idTarefa, idUsuario]
    const result = await client.query(query, values)
    fecharConexao(client)
    return result.rowCount == 0
}

export async function salvarTarefaFeita(idTarefa: String, idUsuario: String) {
    const client = await iniciarConexao()
    const query = 'INSERT INTO tarefa_feita (id_tarefa, id_usuario) VALUES ($1, $2) RETURNING *'
    const values = [idTarefa, idUsuario]
    const result = await client.query(query, values)
    fecharConexao(client)
    return result.rows[0]
}