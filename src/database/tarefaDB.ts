import pool from './index';
import TarefaDTO from '../dto/tarefaDTO';

export async function getTarefas() {
    const result = await pool.query('SELECT * FROM tarefa');
    return result.rows
}

export async function getTarefasFromModulo(id: String) {
    const query = 'select (select count(*) from tarefa as tar where id_modulo = $1) as tarefas,' +
    '(select count(*) from tarefa as tar inner join tarefa_feita as tarf on tar.id = tarf.id_tarefa where id_modulo = $1) as tarefa_feitas;'
    const result = await pool.query(query, [id]);
    return result.rows[0]
}

export async function getTarefa(id: String) {
    const query = 'SELECT * FROM tarefa where id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
}

export async function addTarefa(tarefa: TarefaDTO) {
    const query = 'INSERT INTO tarefa (nome, conteudo, tipo, tarefa_exp, id_modulo) VALUES ($1, $2, $3, $4, $5) RETURNING *'
    const values = [tarefa.nome, tarefa.conteudo, tarefa.tipo, tarefa.tarefa_exp, tarefa.idModulo]
    const result = await pool.query(query, values)
    return result.rows[0]
}

export async function updateTarefa(id: String, updatedTarefa: TarefaDTO) {
    const query = 'UPDATE tarefa SET nome = $1, conteudo = $2, tipo = $3, tarefa_exp = $4, id_modulo = $5 WHERE id = $6'
    const values = [updatedTarefa.nome, updatedTarefa.conteudo, updatedTarefa.tipo, updatedTarefa.tarefa_exp, updatedTarefa.idModulo, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function deleteTarefa(id: String) {
    const query = 'DELETE FROM tarefa WHERE id = $1'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}