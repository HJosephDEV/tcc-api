import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

export async function iniciarConexao(): Promise<Pool> {
    const pool = new Pool({
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		database: process.env.DB_DATABASE,
		password: process.env.DB_PASSWORD,
		port: parseInt(process.env.DB_PORT ?? '5432', 10) // Convertendo para número inteiro,
	});
	return pool
}

export function fecharConexao(pool: Pool) {
	return pool.end()
}