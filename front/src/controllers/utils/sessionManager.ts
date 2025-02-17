import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { initializeSocket } from './socketManager'
import { Int32 } from 'typeorm';


type Session = {
    id: string;
    company_id: string,
    session: string;
    client: any,
    webhooks: Object,
    createdAt: Date;
    status: string;
};

const sessions: Session[] = [];


export async function createSession(client: any, id_: string, search: string, type: keyof Session, companyId: string, nameOfSession: string, status: string, webhooks_: any): Promise<any> {

    const existingSession = sessions.find(s => s[type] === search);
    if (existingSession) {
        // console.log('\r\nSessão existente: ', existingSession);
        return existingSession;
    }

    //se não existir id então gerar
    //let id = uuidv4()

    const newSession: Session = {
        id: id_,
        company_id: companyId,
        session: nameOfSession,
        client,
        webhooks: webhooks_,
        createdAt: new Date(),
        status
    }

    sessions.push(newSession);
    console.log("\r\nSessões criadas: ", sessions)

    // console.log('\r\nA sessão foi armazenada em memória: ', newSession);
    return newSession
}


export async function sessionExists(search: string, type: keyof Session): Promise<boolean> {
    const exists = sessions.some(item => item[type] === search);
    return exists;
}

//await removeSession('session1', 'id1');
export async function removeSession(search: string, type: keyof Session): Promise<boolean> {
    const sessionIndex = sessions.findIndex(s => s[type] === search);

    if (sessionIndex !== -1) {
        const removedSession = sessions.splice(sessionIndex, 1)[0];
        //console.log('Session removed:', removedSession);
        return true
    } else {
        console.log('Session not found.');
        return false
    }
}

//exemplo de uso:
// await updateSession('session1', 'id1', { status: 'inactive' });
export async function updateSession(search: string, type: keyof Session, updates: Partial<Session>): Promise<any> {
    const existingSession = sessions.find(s => s[type] === search);
    if (!existingSession) {
        console.log('Session not found.');
        return false;
    }

    // Atualiza as informações da sessão
    Object.assign(existingSession, updates);
    //console.log('Session updated:', existingSession);
    return existingSession
}

//const sessionByStatus = await findSessionByProperty('status', 'inactive');
export async function findSessionByProperty(property: keyof Session, value: any): Promise<any> {
    const session = sessions.find(s => s[property] === value);
    return session;
}

//arquivos de cache
export async function setupCache(session: string, store: any, type: string): Promise<boolean> {

    let filePath = `./auth_info_baileys/${session}/baileys_store.json`
    let dir = `./auth_info_baileys/${session}`

    try {
        //verificar e criar pasta e arquivo
        let exist = fs.existsSync(dir)

        if (!exist && !type) {

            fs.mkdirSync(dir);

        } else if (exist && type == 'remove') {

            await removeDirectory(dir)
            return true
        }

        const fileExists = await fs.promises.access(filePath, fs.constants.F_OK)
            .then(() => true)
            .catch(() => false);

        if (fileExists) {
            // can be read from a file
            store.readFromFile(filePath)
            // saves the state to a file every 10s
            setInterval(() => {
                store.writeToFile(filePath)
            }, 10_000)

        } else {
            console.log('\r\nErro ao criar o arquivo JSON:');
            return false
        }

    } catch (error) {

        // console.log('\r\nErro ao criar o arquivo JSON:', error);
        return false

    }


    return true

}

//remover diretorio com todos os arquivos
export async function removeDirectory(dirPath: string): Promise<void> {
    try {
        const files = await fs.promises.readdir(dirPath);

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = await fs.promises.lstat(filePath);

            if (stat.isDirectory()) {
                await removeDirectory(filePath); // Recursivamente remove subdiretórios
            } else {
                await fs.promises.unlink(filePath); // Remove arquivos

            }
        }

        await fs.promises.rmdir(dirPath); // Remove o diretório vazio
        console.log(`Diretório ${dirPath} removido com sucesso.`);

        //remover arquivos json (fora da pasta)        
        deleteJsonFiles('./auth_info_baileys')

    } catch (error) {
        console.error(`Erro ao remover o diretório ${dirPath}:`, error);
    }
}

// Função para apagar arquivos .json de uma pasta
const deleteJsonFiles = (directoryPath: string) => {
    // Lê o conteúdo da pasta
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(`Erro ao ler a pasta: ${err.message}`);
            return;
        }

        // Filtra e apaga arquivos .json
        files.forEach(file => {
            if (path.extname(file) === '.json') {
                const filePath = path.join(directoryPath, file);
                fs.unlink(filePath, err => {
                    if (err) {
                        console.error(`Erro ao apagar o arquivo ${file}: ${err.message}`);
                    } else {
                        console.log(`Arquivo ${file} apagado com sucesso.`);
                    }
                });
            }
        });
    });
};