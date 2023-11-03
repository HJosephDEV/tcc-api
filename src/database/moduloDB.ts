import { fecharConexao, iniciarConexao } from './index';
import ModuloDTO from '../dto/moduloDTO';

export async function getModulos() {
    const client = await iniciarConexao()
    try {
        const result = await client.query('SELECT * FROM modulo');
        fecharConexao(client)
        return result.rows
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function getModulosIniciados(idUsuario: String) {
    const client = await iniciarConexao()
    try {
        const query = 'SELECT * FROM MODULO m where (SELECT (COUNT(*) > 0) FROM tarefa_feita tf JOIN tarefa t ON tf.id_tarefa = t.id WHERE t.id_modulo = m.id and id_usuario = $1) = true'
        const values = [idUsuario]
        const result = await client.query(query, values);
        fecharConexao(client)
        return result.rows
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function getModulo(id: String) {
    const client = await iniciarConexao()
    try {
        const query = 'SELECT * FROM modulo where id = $1'
        const result = await client.query(query, [id])
        fecharConexao(client)
        return result.rows[0]
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function getModuloProgresso(idUser: String, idModule: String) {
    const client = await iniciarConexao()
    try {
        const query = 'select m.id, m.nome, (select count(*) from tarefa t where id_modulo = $1) as total, (select count(*) from tarefa t join tarefa_feita tf on t.id = tf.id_tarefa and t.id_modulo = $2 where tf.id_usuario = $3) as concluido from modulo m where id = $4'
        const values = [idModule, idModule, idUser, idModule]
        const result = await client.query(query, values)
        fecharConexao(client)
        return result.rows[0]
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}


export async function addModulo(modulo: ModuloDTO) {
    const client = await iniciarConexao()
    try {
        const query = 'INSERT INTO modulo (nome, descricao) VALUES ($1, $2) RETURNING *'
        const values = [modulo.nome, modulo.descricao]
        const result = await client.query(query, values)
        fecharConexao(client)
        return result.rows[0]
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function updateModulo(id: String, updatedModulo: ModuloDTO) {
    const client = await iniciarConexao()
    try {
        const query = 'UPDATE modulo SET nome = $1, descricao = $2 WHERE id = $3'
        const values = [updatedModulo.nome, updatedModulo.descricao, id]
        const result = await client.query(query, values)
        fecharConexao(client)
        return result.rowCount > 0
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function deleteModulo(id: String) {
    const client = await iniciarConexao()
    try {
        const query = 'DELETE FROM modulo WHERE id = $1'
        const values = [id]
        const result = await client.query(query, values)
        fecharConexao(client)
        return result.rowCount > 0
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}

export async function verificarModuloExistente(titulo: String) {
    const client = await iniciarConexao()
    try {
        const query = 'SELECT (count(id) > 0) AS existe FROM modulo m WHERE m.nome = $1'
        const values = [titulo]
        const result = await client.query(query, values)
        fecharConexao(client)
        return result.rows[0]['existe']
    } catch (error) {
        console.log(error)
        fecharConexao(client)
    }
}