import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize'; // Para definir o tipo de banco de dados
import { config } from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
config();

// Definir as configurações do banco de dados
const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT as 'mysql' | 'postgres' | 'sqlite' | 'mariadb',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    models: [__dirname + '/../models'], // Diretório onde estarão os models
    logging: false, // Para desativar logs SQL
});

export default sequelize;
