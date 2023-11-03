import { fecharConexao, iniciarConexao } from './index';

export async function addImagem(url: string) {
    const pool = await iniciarConexao()
    try {
        const client = await pool.connect()
        const query = 'INSERT INTO imagem (url) VALUES ($1) RETURNING *'
        const values = [url]
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

export async function getImagem(id: string) {
    const pool = await iniciarConexao()
    try {
        const query = 'SELECT * from imagem where id = $1'
        const values = [id]
        const result = await pool.query(query, values)
        fecharConexao(pool)
        return result.rows[0]
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
        throw error
    }
}