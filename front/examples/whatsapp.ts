import { Boom } from '@hapi/boom';
import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion,
    SignalKeyStore,
    makeCacheableSignalKeyStore,
    WASocket,
    isJidBroadcast,
    WABrowserDescription,
    proto,
    makeInMemoryStore,
    useMultiFileAuthState,
    WAMessageContent,
    WAMessageKey,
} from '@whiskeysockets/baileys';
import NodeCache from 'node-cache';
import { toDataURL } from 'qrcode';
//import { env } from '../envConfig';
//import { RabbitMQService } from '../rabbitmq';
import Pino from 'pino';
import { release } from 'os';
//import { logger as log } from '../utils';
import path from 'path';
import fs from 'fs';
//const dirTokens = path.resolve(`./tokens/${env.INSTANCE}`);
//let existDirTokens: boolean = fs.existsSync(dirTokens);

const Logger: any = Pino({
    level: 'info',
    base: null,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
    serializers: {
        err: Pino.stdSerializers.err,
        req: Pino.stdSerializers.req,
        res: Pino.stdSerializers.res,
    },
});

const useStore = !process.argv.includes('--no-store');
const store = useStore ? makeInMemoryStore({ logger: Logger }) : undefined;

/*if (existDirTokens) store?.readFromFile(`${dirTokens}/data.json`);

setInterval(() => {
    if (existDirTokens) store?.writeToFile(`${dirTokens}/data.json`);
}, 10e3); */

export class WhatsappService {
    private msgRetryCounterCache = new NodeCache();

    async start(): Promise<WASocket> {
        try {
            return await new Promise<WASocket>((resolve, reject) => {
                (async () => {
                    const { state, saveCreds } = await useMultiFileAuthState(
                        `./tokens`,
                    );

                    //     const RabbitMQ = await RabbitMQService.getInstance();

                    const { version, isLatest } = await fetchLatestBaileysVersion();
                    // log.debug(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

                    const browser: WABrowserDescription = [
                        'teste',
                        'teste2',
                        release(),
                    ];

                    const sock: WASocket = makeWASocket({
                        version,
                        logger: Logger,
                        printQRInTerminal: true,
                        auth: {
                            creds: state.creds,
                            keys: makeCacheableSignalKeyStore(
                                state.keys as SignalKeyStore,
                                Logger,
                            ),
                        },
                        mediaCache: new NodeCache(),
                        userDevicesCache: new NodeCache(),
                        generateHighQualityLinkPreview: true,
                        connectTimeoutMs: 60_000,
                        defaultQueryTimeoutMs: undefined,
                        browser,
                        emitOwnEvents: true,
                        syncFullHistory: true,
                        appStateMacVerification: { patch: true, snapshot: true },
                        shouldIgnoreJid: jid => isJidBroadcast(jid),
                        msgRetryCounterCache: this.msgRetryCounterCache,
                        transactionOpts: { maxCommitRetries: 1, delayBetweenTriesMs: 10 },
                        patchMessageBeforeSending: message => {
                            const requiresPatch = !!(
                                message.buttonsMessage
                                || message.templateMessage
                                || message.listMessage
                            );
                            if (requiresPatch) {
                                message = {
                                    viewOnceMessage: {
                                        message: {
                                            messageContextInfo: {
                                                deviceListMetadataVersion: 2,
                                                deviceListMetadata: {},
                                            },
                                            ...message,
                                        },
                                    },
                                };
                            }
                            return message;
                        },

                        getMessage: async key => this.getMessage(key),
                    });

                    sock.ev.process(async events => {
                        if (events['connection.update']) {
                            const update = events['connection.update'];
                            const { connection, lastDisconnect, qr } = update;
                            if (lastDisconnect?.error) {
                                const { statusCode } =
                                    (lastDisconnect!.error as Boom)?.output || {};
                                const closeReason: string = DisconnectReason[statusCode];
                                console.log(closeReason);
                                if (closeReason === 'loggedOut') {
                                    console.log('Connection closed. You are logged out.');
                                    //  existDirTokens = false;
                                    //fs.rmdirSync(dirTokens, { recursive: true });
                                }
                                if (closeReason !== undefined) {
                                    /*   await RabbitMQ.publishInQueue(env.INSTANCE, {
                                           wook: 'STATUS_CONNECT',
                                           connectionState: connection,
                                           messageType: 'connection_update',
                                           closeReason: closeReason,
                                       }); */
                                    this.start();
                                }
                            }

                            if (connection === 'connecting') return;

                            if (qr) {
                                const qrCode = await toDataURL(qr);
                                const object = {
                                    wook: 'QRCODE',
                                    result: 200,
                                    INSTANCE: 'sessao-1',
                                    qrcode: qrCode,
                                    urlCode: qr,
                                };

                                // await RabbitMQ.publishInQueue(env.INSTANCE, object);
                                // log.debug(`QR code received, please scan the QR code.`);
                            }

                            //log.debug('connection update', update);
                        }

                        if (events['creds.update']) {
                            await saveCreds();
                        }
                    });
                    global.sock = sock;

                    resolve(sock);
                })().catch(reject);
            });
        } catch (error: any) {
           // console.log(error.toString());
            process.exit(1);
        }
    }

    public async getMessage(
        key: WAMessageKey,
    ): Promise<WAMessageContent | undefined> {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid!, key.id!);
            return msg?.message || undefined;
        }
        return proto.Message.fromObject({});
    }
}
