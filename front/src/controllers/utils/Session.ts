// Função para obter os dados do usuário logado
import express, { Request, Response } from 'express';
// Definição da interface para a sessão
// Definição da interface para a sessão
declare module 'express-session' {
    interface SessionData {
        user?: {
            login: boolean;
            token: string;
            session: UserSession;
        };
    }
}

// Interface para os dados da sessão do usuário
interface UserSession {
    id_usr: number;
    owner_id: number;
    nome: string;
    telefone: string;
    email: string;
    password: string;
    type_usuario: string;
    data_expiracao: string;
    status: string | null;
    token: string;
    createdAt: string;
    updatedAt: string;
}

// Função para obter os dados da sessão do usuário logado
export const getUserSession = (req: Request): UserSession | null => {
    return req.session?.user?.session ?? null;
};