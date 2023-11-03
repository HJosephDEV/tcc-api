import { fecharConexao, iniciarConexao } from './index';
import CursoDTO from '../dto/cursoDTO';

export async function getCursos() {
    const pool = await iniciarConexao()
    try {
        const result = await pool.query('SELECT * FROM curso')
        fecharConexao(pool)
        return result.rows
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
    }
}

export async function getCurso(id: String) {
    const pool = await iniciarConexao()
    try {
        const query = 'SELECT * FROM curso where id = $1'
        const result = await pool.query(query, [id])
        fecharConexao(pool)
        return result.rows[0]
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
    }
}

export async function addCurso(curso: CursoDTO) {
    const pool = await iniciarConexao()
    try {
        const query = 'INSERT INTO curso (nome, imagem) VALUES ($1, $2) RETURNING *'
        const values = [curso.nome, curso.imagem]
        const result = await pool.query(query, values)
        fecharConexao(pool)
        return result.rows[0]
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
    }
}

export async function updateCurso(id: String, updatedCurso: CursoDTO) {
    const pool = await iniciarConexao()
    try {
        const query = 'UPDATE curso SET nome = $1, imagem = $2 WHERE id = $3'
        const values = [updatedCurso.nome, updatedCurso.imagem, id]
        const result = await pool.query(query, values)
        fecharConexao(pool)
        return result.rowCount > 0
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
    }
}

export async function deleteCurso(id: String) {
    const pool = await iniciarConexao()
    try {
        const query = 'DELETE FROM curso WHERE id = $1'
        const values = [id]
        const result = await pool.query(query, values)
        fecharConexao(pool)
        return result.rowCount > 0
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
    }
}

export async function checkUsuarioCursoExists(idUser: String, idCourse: String) {
    const pool = await iniciarConexao()
    try {
        const query = 'select exists(select 1 from usuario where id = $1) and exists(select 1 from curso where id = $2) as existe'
        const values = [idUser, idCourse]
        const result = await pool.query(query, values)
        fecharConexao(pool)
        return result.rows[0]['existe']
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
    }
}

export async function checkCursoInscrito(idUser: String, idCourse: String) {
    const pool = await iniciarConexao()
    try {
        const query = 'select exists(select 1 as existe from curso_inscrito where id_usuario = $1 and id_curso = $2) as existe'
        const values = [idUser, idCourse]
        const result = await pool.query(query, values)
        fecharConexao(pool)
        return result.rows[0]['existe']
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
    }
}

export async function addInscricaoCurso(idUser: String, idCourse: String) {
    const pool = await iniciarConexao()
    try {
        const query = 'INSERT INTO curso_inscrito (id_curso, id_usuario) values ($1, $2)'
        const values = [idCourse, idUser]
        const result = await pool.query(query, values)
        fecharConexao(pool)
        return result.rowCount > 0
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
    }
}