import pool from './index';
import CursoDTO from '../dto/cursoDTO';

export async function getCursos() {
    const result = await pool.query('SELECT * FROM curso');
    return result.rows
}

export async function getCurso(id: String) {
    const query = 'SELECT * FROM curso where id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
}

export async function addCurso(curso: CursoDTO) {
    const query = 'INSERT INTO curso (nome, duracao, imagem) VALUES ($1, $2, $3) RETURNING *'
    const values = [curso.nome, curso.duracao, curso.imagem]
    const result = await pool.query(query, values)
    return result.rows[0]
}

export async function updateCurso(id: String, updatedCurso: CursoDTO) {
    const query = 'UPDATE curso SET nome = $1, duracao = $2, imagem = $3 WHERE id = $4'
    const values = [updatedCurso.nome, updatedCurso.duracao, updatedCurso.imagem, id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function deleteCurso(id: String) {
    const query = 'DELETE FROM curso WHERE id = $1'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}

export async function checkUsuarioCursoExists(idUser: String, idCourse: String) {
    const query = 'select exists(select 1 from usuario where id = $1) and exists(select 1 from curso where id = $2) as existe'
    const values = [idUser, idCourse]
    const result = await pool.query(query, values)
    return result.rows[0]['existe']
}

export async function checkCursoInscrito(idUser: String, idCourse: String) {
    const query = 'select exists(select 1 as existe from curso_inscrito where id_usuario = $1 and id_curso = $2) as existe'
    const values = [idUser, idCourse]
    const result = await pool.query(query, values)
    return result.rows[0]['existe']
}

export async function addInscricaoCurso(idUser: String, idCourse: String) {
    const query = 'INSERT INTO curso_inscrito (id_curso, id_usuario) values ($1, $2)'
    const values = [idCourse, idUser]
    const result = await pool.query(query, values)
    return result.rowCount > 0
}