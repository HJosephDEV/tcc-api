"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// logger.ts
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
    })),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Adicionar o transporte Http para fazer logging de requisições HTTP
        new winston_1.transports.Http({
            host: 'localhost',
            port: 3001,
            path: '/log',
            ssl: false // Configuração de segurança (true para habilitar SSL)
        })
    ]
});
exports.default = logger;
