import axios from 'axios';

/* 
      exemplo de uso:

          const webhookUrl = process.env.WEBHOOK_URL; // Pegando a URL do webhook de uma variável de ambiente

          const payload: WebhookPayload = {
          message: 'Olá, webhook!',
          timestamp: new Date(),
          // Outros campos conforme necessário
          };

          sendToWebhook(webhookUrl, payload);
  
  */

interface WebhookPayload {
    // Defina a estrutura dos dados que você deseja enviar ao webhook
    data: Object;
    timestamp: Date;
    // Adicione outros campos conforme necessário
}

export async function sendToWebhook(url: string | undefined, payload: WebhookPayload): Promise<boolean> {
    if (!url) {
        console.log('Webhook URL não fornecida. Dados não enviados.');
        return false;
    }

    try {
        const response = await axios.post(url, payload);
        console.log('\r\nDados enviados para webhook com sucesso:', response.data);
        return true
    } catch (error) {
        console.error('Erro ao enviar dados ao webhook:', error);
        return false
    }
}
