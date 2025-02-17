import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import fs from 'fs';
import os from 'os';
import { join } from 'path';
const homeDirectory = os.homedir();

// Função para criar um diretório se ele não existir
function ensureDirSync(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Criação do formato de log
const logFormat = winston.format.printf(
    ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);


// Logger padrão sem transportes definidos
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
    ),
    transports: [],
});

logger.add(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.splat(),
            winston.format.colorize()
        ),
    })
);

export { logger }
