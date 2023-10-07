import pool from './index';
import ModuloDTO from '../dto/moduloDTO';

export async function getModulos() {
    const result = await pool.query('SELECT * FROM modulo');
    return result.rows
}

export async function getModulo(id: String) {
    const query = 'SELECT * FROM modulo where id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
}

export async function addModulo(modulo: ModuloDTO) {
    const query = 'INSERT INTO modulo (nome, descricao, id_curso) VALUES ($1, $2, $3) RETURNING *'
    const values = [modulo.nome, modulo.descricao, modulo.idCurso]
    const result = await pool.query(query, values)
    return result.rows[0]
}

export async function updateModulo(id: String, updatedModulo: ModuloDTO) {
    const query = 'UPDATE modulo SET nome = $1, descricao = $2, id_curso = $3 WHERE id = $4'
    const values = [updatedModulo.nome, updatedModulo.descricao, updatedModulo.idCurso, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function deleteModulo(id: String) {
    const query = 'DELETE FROM modulo WHERE id = $1'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}