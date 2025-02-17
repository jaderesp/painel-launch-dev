import { Server, Socket } from 'socket.io';
import http from 'http';
import { Op } from "sequelize";
import { createSession, findSessionByProperty, updateSession, sessionExists, removeSession } from "./sessionManager"
import { TicketModel } from '../../models/TicketModel';
import TicketService from '../../services/TicketService';
import ContatoService from '../../services/ContatoService';
import MessageService from '../../services/MensagemService';
import ConfiguracoesController from '../../controllers/ConfiguracoesController';
import { getVerifyOfflineMessage } from './ConfAtendimento'
import { BASE_URL, UPLOAD_FILES_DIR, PUBLIC_FILES_DIR } from '../../config';
import path from 'path';
import fs from 'fs';


let io: Server;

interface ClientSocket extends Socket {
    id_?: string;
    userData?: object,
    isRegistered?: boolean;
}

// Objeto para armazenar buffers recebidos
const fileBuffers: Record<string, Buffer[]> = {};

export const initializeSocket = (io_: Server) => {

    io = io_

    //ouvir o servidor sockets
    io.on('connection', async (socket: ClientSocket) => {

        const { id_, name, email } = socket.handshake.query;

        console.log('Cliente socket connected');

        if (id_ && name) {

            let existSess = await sessionExists(id_.toString(), "id")

            if (existSess) {

                //atualizar o socket client
                updateSession(id_.toString(), "id", { "client": socket })

            } else {
                //criar session            
                createSession(socket, id_.toString(), id_.toString(), "id", "", name.toString(), "online", []);

            }

            let session = await findSessionByProperty("id", id_.toString())
            console.log("SESSÃO ATUALIZADA: ", session)

        }

        //criar sessão

        // Associe um ID de cliente ao socket
        socket.on('register', async (objId: any) => {

            let { id_ } = objId ? objId : { id_: null }
            if (!socket.isRegistered && id_) {

                socket.id_ = id_;
                socket.isRegistered = true; // Marca o socket como registrado
                socket.join(id_);

                //atualizar status do contato para online
                await ContatoService.update({ status: "online" }, { idContato: id_ })
                //emitir evento contacto online
                io.sockets.emit(`onPresense`, { id: id_, connected: true, status: "online" })

                console.log(`Client id ${id_} registered and joined company id: ${id_} (socket id)`);
            } else {
                console.log(`Client id ${id_} is already registered.`);
            }
        });

        //teste  de mensagem
        socket.on('message', async (message) => {

            let { from, to, msg, ticketId } = message

            let ticketData: any | null = await TicketService.getOne({ 'id_ticket': ticketId })
            let { id_ticket, idusuario, idContato, status } = ticketData
            let atendido = (idusuario) ? true : false

            console.log(`Client ${id_} enviou uma mensagem:`, message);
            //se a mensagem for enviada para um ticket que ainda não foi atendido(informar o usuario cliente do ticket)
            to = (to) ? to : (idusuario) ? idusuario : idContato
            let session = await findSessionByProperty("id", to.toString())

            if (session) {

                if ("id" in session) {

                    let { client } = session

                    //verificar tipo de usuario
                    let contatoRemet: any | null = await ContatoService.getOne({ idContato: from })
                    let contato: any | null = await ContatoService.getOne({ idContato: to })
                    let fromMe = (contato?.type !== 'CONTACT') ? true : false
                    let isMe = (contato?.type == 'USER') ? true : false //EU O BOT ENVIANDO COMO SENDO EU MESMO

                    if (contato?.type !== 'CONTACT') {
                        contato = await ContatoService.getOne({ idContato: from })
                    }

                    //verificar se está em horario de atendimento
                    let msgOffline = await getVerifyOfflineMessage()

                    if (msgOffline && contatoRemet.type === 'CONTACT') {
                        io.sockets.emit(`reply_${from.toString()}`, { id_ticket, to, from, "msg": msgOffline });
                        client.emit(`reply_${to.toString()}`, { id_ticket, to, from, isMe, "msg": msgOffline });
                    }


                    //salvar mensagem no banco de dados
                    let messageData = {
                        id_conta: 1,
                        id_ticket: id_ticket,
                        id_destinatario: to,
                        id_remetente: from,
                        mensagem: msg,
                        ack: 1,
                        type: 'text',
                        fromMe: fromMe,
                    }

                    //salvar  mensagem (layout do retorno o padrão dos dados é padrão da tabela)
                    let messageAdded = await MessageService.create(messageData, false)
                    let { type, ack } = messageData
                    message = { ...message, type, ack, fromMe, ticketData }

                    //registrar ultima mensagem do ticket (chat)
                    await TicketService.update({ id_ticket }, { lastMessage: msg })

                    if (atendido) {

                        client.emit(`reply_${to.toString()}`, message);

                    } else {
                        //se o ticket não foi atendido por ninguem (enviar mensagem para todos)
                        io.sockets.emit(`broadcast`, message);

                    }

                } else {

                    console.log("Não foi possível encontrar a sessão do  destinatário")

                }

            } else {

                //enviar mensagem ao remetente que o destinatário está offline
                socket.emit(`reply_${to.toString()}`, { to, from, "msg": "O destinatário está offline..." })
            }

            //pegar sessão do contato contendo seu clientSocket para envio da resposta

        });

        //evento para registro de status de leitura de mensagem
        socket.on('onAck', async (data) => {
            let { ack, ticketId } = data

            let res = await MessageService.update({ ack }, { id_ticket: ticketId }) // 3= mensagem recebida e lida
            console.log(`\r\n Satus de leitura da mensagem ${ticketId} ack: ${ack}.`)

            //alterar status de todas as mensagem do ticket como lida (read==true)


        })


        //soccket upload files (parts)
        // Receber partes do arquivo
        socket.on(
            "file-upload",
            ({ metadata, buffer, objectData }: { metadata: any; buffer: Buffer; objectData: any }) => {
                const filePath = path.join(UPLOAD_FILES_DIR, metadata.filename);

                // Inicializar o armazenamento de buffers se necessário
                if (!fileBuffers[socket.id]) {
                    fileBuffers[socket.id] = [];
                }

                fileBuffers[socket.id].push(buffer);

                console.log(
                    `\r\n💾Recebido chunk de ${buffer.length} bytes para o arquivo ${metadata.filename}`
                );
            }
        );

        // Finalizar a recepção do arquivo
        socket.on("file-upload-complete", async ({ metadata, objectData }: { metadata: any; objectData: any }, callback: any) => {

            let messageRcv = objectData
            //salvar mensagem no banco de dados e dar feedback front
            if ("from" in messageRcv) {

                let { to, from, ticketId } = messageRcv

                let ticketData: any | null = await TicketService.getOne({ 'id_ticket': ticketId })
                let { id_ticket, idusuario, idContato, status } = ticketData
                let atendido = (idusuario) ? true : false
                //se a mensagem for enviada para um ticket que ainda não foi atendido(informar o usuario cliente do ticket)
                to = (to) ? to : (idusuario) ? idusuario : idContato

                let contatoRemet: any | null = await ContatoService.getOne({ idContato: from })
                let contato: any | null = await ContatoService.getOne({ idContato: to })
                let fromMe = (contato?.type !== 'CONTACT') ? true : false //O REMENTENTE SOU EU
                let isMe = (contato?.type == 'USER') ? true : false //EU O BOT ENVIANDO COMO SENDO EU MESMO

                if (contato?.type !== 'CONTACT') {
                    contato = await ContatoService.getOne({ idContato: from })
                }

                //diretorio dos arquivos
                const mediaUrl = `uploads/${id_ticket}/${metadata.filename}`;

                let baseDir = `${UPLOAD_FILES_DIR}/${id_ticket}`
                const filePath = path.join(`${baseDir}`, metadata.filename);

                // Garantir que o diretório de uploads exista
                if (!fs.existsSync(baseDir)) {
                    fs.mkdirSync(baseDir);
                }

                // Recompôr o arquivo
                const fileBuffer = Buffer.concat(fileBuffers[socket.id]);
                fs.writeFileSync(filePath, fileBuffer);

                // Log adicional com os dados enviados
                //console.log("Arquivo salvo:", filePath);
                //console.log("Dados do objeto:", messageRcv);

                let sizeFile = Buffer.byteLength(fileBuffer);
                // Limpar o buffer armazenado
                delete fileBuffers[socket.id];

                try {

                    const { filename, mimetype } = metadata;

                    let session = await findSessionByProperty("id", to.toString())
                    let sessionDest = await findSessionByProperty("id", from.toString())

                    if (session) {
                        //tratar os dados do atendimento
                        let { client } = session

                        //verificar se está em horario de atendimento
                        let msgOffline = await getVerifyOfflineMessage()

                        if (msgOffline && contatoRemet.type === 'CONTACT') {
                            io.sockets.emit(`reply_${from.toString()}`, { id_ticket, to, from, "msg": msgOffline });
                            client.emit(`reply_${to.toString()}`, { id_ticket, to, from, isMe, "msg": msgOffline });
                        }

                        //verificar tipo de usuario                       

                        let messageData: any = {
                            id_conta: 1,
                            id_ticket: id_ticket,
                            id_destinatario: messageRcv.to,
                            id_remetente: messageRcv.from,
                            mensagem: messageRcv.msg || null,
                            ack: 1,
                            type: messageRcv.type?.toUpperCase() || 'MEDIA',
                            fromMe: fromMe,
                            mediaUrl: mediaUrl,
                            mimetype: mimetype,
                            size_file: sizeFile ? sizeFile : 0,
                        };

                        //console.log("Dados recebidos:", messageData);

                        messageData.mediaUrl = mediaUrl;

                        // Salvar mensagem no banco de dados
                        let messageAdded = await MessageService.create(messageData, true)

                        // Simular gravação no banco de dados
                        console.log("\r\n💾Mensagem de mídia salva no banco:", messageAdded);
                        // Enviar mensagem para o destinatário
                        let message = messageRcv

                        let { size_file, ack, type } = messageData
                        message = { ...message, id_ticket, type, ack, fromMe, mediaUrl, mimetype, size_file, ticketData }

                        message.mediaUrl = message.mediaUrl ? `${BASE_URL}/${mediaUrl}` : null;

                        if (atendido) {
                            //enviar dados de registro da mensagem para o destinatario
                            client.emit(`reply_${to.toString()}`, message);
                            //enviar dados de registro da mensagem para o remetente
                            sessionDest.client.emit(`reply_${from.toString()}`, message);
                        } else {
                            //enviar mensagem para todos atendentes
                            io.sockets.emit(`broadcast`, message)
                        }
                    } else {
                        //enviar mensagem ao remetente que o destinatário está offline
                        socket.emit(`reply_${from.toString()}`, { to, from, "msg": "O destinatário está offline..." })
                    }

                } catch (error) {

                    console.log("Erro ao processar mensagem:", error);
                    socket.emit(`reply_${from.toString()}`, { to, from, "msg": "Erro ao processar a mensagem...", error })
                    // Responder ao cliente com erro
                    //callback({ success: false, info: "Erro ao enviar a mensagem", error });
                }

            } else {

                socket.emit("upload-error", { message: "Erro ao processar o arquivo, Dados do arquivo não recebidos!" });

            }

            socket.emit("upload-success", { message: "Arquivo salvo com sucesso!" });

        });


        //enveto de ação de digitação de mensagem
        socket.on(`setKeyActions`, async (data) => {
            let { from, to, isTyping, ticketId } = data

            console.log(`Client ${from} está digitando uma mensagem: `, data);

            let ticketData: any | null = await TicketService.getOne({ 'id_ticket': ticketId })
            let { id_ticket, idusuario, idContato, status } = ticketData
            //se a mensagem for enviada para um ticket que ainda não foi atendido(informar o usuario cliente do ticket)
            to = (to) ? to : (idusuario) ? idusuario : idContato

            let session = await findSessionByProperty("id", to.toString())

            if (session) {

                if ("id" in session) {

                    let { client } = session

                    io.sockets.emit(`onKeyActions_${to.toString()}`, data)
                    //io.sockets.emit(`reply_${ to.toString() }`, data);

                } else {

                    console.log("Não foi possível encontrar a sessão do  destinatário")

                }

            }

        })

        //eventos para iniciar, finalizar atendimento
        socket.on(`setAtender`, async (atendimento) => {

            let { from, to, ticketId, status, transferir } = atendimento

            if (to) {

                console.log(`O atendente ${from} alterou o atendimento para ${status}: ${to}: `);

                let atendente: any | null = await ContatoService.getOne({ idContato: from })
                let contato: any | null = await ContatoService.getOne({ idContato: to })

                //atualizar status do ticket
                let idAtendente = from.toString()
                await TicketService.update({ status, idusuario: idAtendente }, { id_ticket: ticketId })

                //pegar dados do ticket atualizado (pós alterações)
                let ticketData: any | null = await TicketService.getOne({ id_ticket: ticketId })

                let { protocolo } = ticketData
                let { nome } = contato
                let autoMessage = '';

                if (transferir) {

                    autoMessage = status == 'ANDAMENTO' ? `Olá, ${nome}! Tudo bem? Seu atendimento está sendo transferido para ${atendente?.nome}. \r\n Olá ${nome}, meu nome é ${atendente?.nome} atendê-lo de agora em diante, este é seu protocolo Nº ${protocolo}. Como posso ajudar?` : ''

                } else {
                    autoMessage = status == 'ANDAMENTO' ? `Olá, ${nome}! Tudo bem? Me chamo ${atendente?.nome} e estou entrando em contato para atendê-lo, este é seu protocolo Nº ${protocolo}. Como posso ajudar?` :
                        (status == 'CONCLUIDO' ? `O atendimento foi encerrado. Segue o seu protocolo Nº ${protocolo}. Foi um prazer atendê-lo. Até a próxima!` : ``)
                }
                //regatar mensagem de boas vindas cadastradas no sistema para enviar ao contato
                Object.assign(atendimento, { "msg": autoMessage })
                //emitir evento de atendimento ao cliente
                io.sockets.emit(`onAtender_${to.toString()}`, atendimento)

                //notificar atendimento
                io.sockets.emit(`onNotify_${to.toString()}`, { from, to, type: "ATENDIMENTO", status: "OPEN" })

                //broadcast de alteração de status do atendimento (enviar para o atendente atualizar lista de atendimento)
                // io.sockets.emit(`queueUpdate_${from.toString()}`, atendimento)
                io.sockets.emit(`queueUpdate`, atendimento)

                //enviar mensagem de boas vinda e inicio do atendimento            


                let session = await findSessionByProperty("id", to.toString())

                if (session) {

                    if ("id" in session) {

                        let { client } = session

                        let fromMe = (contato?.type !== 'CONTACT') ? true : false

                        let { msg } = atendimento

                        let messageData: any = {
                            id_conta: 1,
                            id_ticket: ticketId,
                            id_destinatario: to,
                            id_remetente: from,
                            mensagem: msg,
                            ack: 1,
                            type: 'text',
                            fromMe: fromMe,
                        }

                        //salvar  mensagem (layout do retorno o padrão dos dados é padrão da tabela)
                        let messageAdded = await MessageService.create(messageData, false)

                        messageData = { ...messageData, ticketData }
                        //enviar dados de registro da mensagem para o destinatario
                        client.emit(`reply_${to.toString()}`, messageAdded);



                    }
                }

                //enviar notificação para todos os atendentes, atualizar listas de tickets
                io.sockets.emit(`queueUpdate`, ticketData)
            }


        })

        socket.on('disconnect', async () => {

            console.log(`Client ${id_} disconnected`);

            //remover sessão
            if ("id" in socket) {

                let { id_ } = socket
                if (id_) {

                    //setar usuario como offline
                    await ContatoService.update({ status: "offline" }, { idContato: id_ })

                    removeSession(id_.toString(), "id")
                    //emitir evento de desconexão
                    io.sockets.emit(`onPresense`, { id: id_, connected: false, status: "offline" })
                }
            }
            //alterar status do contado para offline
        });

        //se não tiver registrado,desconectar
        if (!socket.isRegistered) {
            console.log(`Client id ${id_}, por pendencia de registro.`);

            socket.emit("connError", ` Client id ${id_}, por pendencia de registro.`)
            // socket.disconnect()
        }

    });
};

export const emitEventToClient = (sessionData: any, eventName: string, data: any) => {
    let { id, company_id, session } = sessionData
    if (io) {
        io.to(company_id).emit(eventName, { data, session_id: id, session });
    }
};

export const socketSendEvent = (sessionData: any, toGroup: Boolean) => {

    let { id, company_id } = sessionData

    const eventData = {
        message: 'New message from WhatsApp',
        timestamp: new Date()
    }

    if (toGroup) {
        // Emita o evento para o cliente específico
        emitEventToClient(company_id, 'whatsappEvent', eventData);

    } else {

        // Emita o evento para o cliente específico
        emitEventToClient(id, 'whatsappEvent', eventData);

    }


}

// Função que emite o evento 'queueUpdate' com os dados do ticket
export const emitQueueUpdateEvent = (action: string, ticket: TicketModel) => {
    if (io) {
        const ticketData = {
            id: ticket.id_ticket,
            users: ticket.idusuario,  // Adicione mais dados conforme necessário
            lastMessageTime: ticket.updatedAt,
            messages: ticket.lastMessage,  // Você pode adicionar mensagens detalhadas se necessário
            stickers: null,  // Preencha se necessário
            onlineStatus: 'offline'  // Atualize com o status real
        };

        io.sockets.emit('queueUpdate', ticket);
        console.log(`Evento 'queueUpdate' emitido para ação: ${action}, ticket: ${ticketData.id}`);
    }
};

