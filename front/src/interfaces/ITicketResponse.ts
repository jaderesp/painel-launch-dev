import { DataType } from "sequelize";

export interface ITicketResponse {
    id: number;
    users: [any, any];
    lastMessageTime: string;
    messages: [];
    stickers: (string | null)[];
    status: string;
    onlineStatus: boolean;
    updatedAt: Date;
}