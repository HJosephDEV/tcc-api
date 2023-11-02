import { fecharConexao, iniciarConexao } from './index';

export async function addImagem(url: string) {
    const client = await iniciarConexao()
    const query = 'INSERT INTO imagem (url) VALUES ($1) RETURNING *'
    const values = [url]
    const result = await client.query(query, values)
    fecharConexao(client)
    return result.rows[0]
}

export async function getImagem(id: string) {
    const client = await iniciarConexao()
    const query = 'SELECT * from imagem where id = $1'
    const values = [id]
    const result = await client.query(query, values)
    fecharConexao(client)
    return result.rows[0]
}