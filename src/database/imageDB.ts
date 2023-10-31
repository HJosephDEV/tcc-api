import pool from './index';

export async function addImagem(url: string) {
    const query = 'INSERT INTO imagem (url) VALUES ($1) RETURNING *'
    const values = [url]
    const result = await pool.query(query, values)
    return result.rows[0]
}

export async function getImagem(id: string) {
    const query = 'SELECT * from imagem where id = $1'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows[0]
}