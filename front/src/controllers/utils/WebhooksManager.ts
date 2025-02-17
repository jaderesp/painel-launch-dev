import { sendToWebhook } from "./httpSender"
import { findSessionByProperty } from "./sessionManager"

export async function senderWebhooks(session: string, type: string, data: any) {

    if (!session) {
        return false
    }

    let sessionInfo = await findSessionByProperty("session", session)

    let webhookUrl = null

    if (Object.keys(sessionInfo).length > 0) {

        try {
            let { webhooks } = sessionInfo

            if (!webhooks) {
                console.log(`\r\n Não existe webhook cadastrado para este fim "${type}".`);
                return false
            }

            if (Object.keys(webhooks).length > 0) {

                if (!webhooks[type]) {
                    console.log(`\r\n A chave "${type}" não foi encontrada no object webhook.`);
                    return false
                }

                webhookUrl = webhooks[type];

                //vericar se url é valida
                try {

                    new URL(webhookUrl);

                } catch (error) {
                    console.log("\r\nNão foi possível enviar dados ao webhook:", error)
                    return false;
                }

                let result = await sendToWebhook(webhookUrl, data)

                if (result) {
                    console.log(`\r\n Dado de ${type} foram enviados ao webhook do cliente "${webhookUrl}".`);
                } else {
                    console.log(`\r\n Ocorreuu porblema ao enviar o dado de ${type} para o webhook do cliente "${webhookUrl}".`);
                }

            } else {
                console.log(`\r\n A chave "${type}" não foi encontrada no object webhook.`);
                return undefined;
            }

        } catch (error) {
            console.log(`\r\n Ocorreu um erro ao enviar o dados ao webhook: ${type}: `, error)
        }

    }

}