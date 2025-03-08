/* 
   server init - 09-04-2024
*/

import express, { Request, Response, NextFunction, Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import router from './routers';
import { FRONTEND_CHAT_URL, PORT, TOKEN } from './config';
import { logger } from './utils';
import { Server, createServer } from 'http';
import path from 'path';
import socket from 'socket.io';
//import { startAllSessions } from './startup';
import axios from 'axios';
import swaggerDocs from "./controllers/utils/swagger";
import * as socketManager from "./controllers/utils/socketManager"
import { config } from 'dotenv';

//sessao
import sessionMiddleware from './config/session';
//inicializar banco de dados e usuario padrão
import sequelize from './config/sequelize'; // Importa a configuração do Sequelize
import { UsuarioService } from './services/index';      // Importa os models (Usuario, etc.)
import { initializeModels } from './models/index';

//jobs (serviços)
import { checkExpirations } from "./jobs/checkExpirations";

async function initialize() {

   initializeModels(sequelize)
   await UsuarioService.createDefaultUsuario()
}


let app: Application = express();
const server = createServer(app);
const io = new socket.Server(server, {
   cors: {
      origin: `${FRONTEND_CHAT_URL}`,
   },
   path: "/api/socketio"
});

app.use(morgan('combined'));

app.use(helmet({ contentSecurityPolicy: false }));

// 🔹 Permite que Express processe FormData corretamente
app.use(express.json({ strict: false, limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));

//add pasta public para uploads e acesso a arquivos
app.use(express.static(path.join(__dirname, '/public')));

//app.set('views', path.join(__dirname, '.', 'views'));
app.set('views', './src/views') /* localidade das views */
app.set('view engine', 'ejs');
// Serve arquivos estáticos da aplicação
app.use(express.static('public'));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(cors({ origin: '*' }));
app.use(sessionMiddleware);

//sockets
//io.setMaxListeners(100);
///socketManager.initializeSocket(io)

//====init routes ===========
app.use(router);

initialize();

//===========================

server.listen(PORT, async () => {
   logger.info(
      `🚀 App rodando via pid: ${process.pid} and na porta: ${PORT}`
   );
   swaggerDocs(app, PORT)

   //executar serviço de atualização de status
   checkExpirations();

});

type ShutdownEvent = 'SIGINT' | 'SIGTERM';
type ShutdownCallback = (code: number) => void;

function gracefulShutdown(
   event: ShutdownEvent,
   server: Server
): ShutdownCallback {
   return (code: number) => {
      logger.info(`${event} received! with ${code}`);
      server.close(() => {
         logger.info('Server terminated successfully');
         process.exit(code);
      });
   };
}

process.on('unhandledRejection', (error) => {
   logger.error(`\nunhandledRejection signal received. \n${error}`);
});

process.on('SIGINT', gracefulShutdown('SIGINT', server));
process.on('SIGTERM', gracefulShutdown('SIGTERM', server));

process.on('exit', (code) => {
   logger.info('exit signal received', code);
});

