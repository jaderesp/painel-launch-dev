export interface IMessageResponse {
    sender: number;        // ID do remetente da mensagem (id_remetente)
    time: Date;            // Timestamp da mensagem (createdAt)
    text: string;          // Conteúdo da mensagem (mensagem)
    mediaUrl: string | null; // URL do sticker ou imagem (mediaUrl)
    type: string | null;
    mimetype: string | null;
    fileSize: number | null;
    read: boolean;         // Se a mensagem foi lida (ack ou custom field)
    status: boolean;       // Status da mensagem (true para sucesso ou outro campo)
}