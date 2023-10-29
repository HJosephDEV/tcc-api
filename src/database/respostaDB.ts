import pool from './index';
import RespostaDTO from '../dto/respostaDTO';

export async function getRespostas(id: String) {
    const query = 'SELECT * FROM resposta where id_tarefa = $1'
    const value = [id]
    const result = await pool.query(query, value);
    return result.rows
}

export async function getRespostasFromTarefa(id: String) {
    const query = 'SELECT id, descricao, id_tarefa FROM resposta where id_tarefa = $1'
    const value = [id]
    const result = await pool.query(query, value);
    return result.rows
}

export async function getResposta(id: String) {
    const query = 'SELECT * FROM resposta where id = $1'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows[0]
}

export async function addResposta(resposta: RespostaDTO, idTarefa: String) {
    const query = 'INSERT INTO resposta (descricao, resposta_correta, id_tarefa) VALUES ($1, $2, $3) RETURNING *'
    const values = [resposta.descricao, resposta.resposta_correta, idTarefa]
    const result = await pool.query(query, values)
    return result.rows[0]
}

export async function updateResposta(id: String, updatedResposta: RespostaDTO) {
    const query = 'UPDATE resposta SET descricao = $1, resposta_correta = $2, id_tarefa = $3 WHERE id = $4'
    const values = [updatedResposta.descricao, updatedResposta.resposta_correta, updatedResposta.idTarefa, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function deleteResposta(id: String) {
    const query = 'DELETE FROM resposta WHERE id = $1'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}