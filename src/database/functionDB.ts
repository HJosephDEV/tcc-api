import { fecharConexao, iniciarConexao } from "."


export async function updateUserDataAndRanking() {
    const pool = await iniciarConexao()
    try {
        const client = await pool.connect()
        const query = 'select atualizar_dados()'
        const result = await client.query(query)
        client.release()
        fecharConexao(pool)
        return result.rowCount > 0
    } catch (error) {
        console.log(error)
        fecharConexao(pool)
        throw error
    }
}