// logger.ts
import { createLogger, transports, format } from 'winston';

const logger = createLogger({
	level: 'info', // Nível do log
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.printf(({ timestamp, level, message }) => {
			return `${timestamp} ${level}: ${message}`;
		})
	),
	transports: [
		new transports.Console(), // Exibir logs no console
		new transports.File({ filename: 'logs/error.log', level: 'error' }), // Salvar logs em arquivo
		// Adicionar o transporte Http para fazer logging de requisições HTTP
		new transports.Http({
			host: 'localhost',
			port: 3001, // Porta para enviar os logs
			path: '/log', // Caminho da rota onde o servidor irá receber os logs
			ssl: false // Configuração de segurança (true para habilitar SSL)
		})
	]
});

export default logger;
