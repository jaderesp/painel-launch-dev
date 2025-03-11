// Função para obter os dados do usuário logado
import express, { Request, Response } from 'express';
import ConfiguracoesService from '../../services/ConfiguracoesService';
import UsuarioService from '../../services/UsuarioService';
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

//retornar op where condicional para consultar dados referente ao usuario (reseller) logado, se for admin liberar acesso a todos os dados
export const identUser = async (req: Request): Promise<any> => {

    let user = getUserSession(req);

    try {

        //retornar somente dados refrente ao usuario logado
        //pegar dados do usuario logado
        let { id_usr } = user ? ('id_usr' in user ? user : { id_usr: null }) : { id_usr: null };
        let { type_usuario } = user ? ('type_usuario' in user ? user : { type_usuario: null }) : { type_usuario: null }

        let where = {}
        //caso não tenha dados de usuario logado, retornar dados do usuario referente ao token informado
        if (!id_usr) {

            const token = req.header("Authorization")?.split(" ")[1]; // Bearer Token

            if (!token) {
                console.log("\r\nNão encontrado dados de token e sessão para autorizar a operação.")
                return null
            }

            where = { token }

        } else {

            where = { id_usr }

        }

        if (Object.keys(where).length > 0) {


            const usuario = await UsuarioService.getSomeOne(where);

            if (Object.keys(usuario).length > 0) {

                id_usr = (id_usr) ? id_usr : (('id_usr' in usuario) ? usuario.id_usr : 0) as any;

                if (!id_usr && type_usuario === 'Reseller') {
                    return null
                }

                return {
                    isAdmin: (type_usuario === 'admin') ? true : false,
                    where: { id_usr }
                };

            } else {
                return null;
            }

        }


    } catch (error) {

        console.log("\r\n Ocorreu um, erro ao resgatar os dados de sessão para identificação para operação: ", error);
        return null;

    }
}

export const getWhereUser = async (req: Request, res: Response) => {

    let where = {}

    //==== INICIO da identificação para requisição de dados ====
    let identData = await identUser(req);

    if (identData) {

        let { isAdmin } = identData;

        if (!isAdmin) {
            if (Object.keys(identData?.where).length > 0) {
                where = identData?.where //adicionar id_usr a requisição dos dados
            } else {
                return res.status(200).json({ message: 'Acesso aos dados não permitido, não foi possível identificar o usuario requisitante.' });
            }
        }

    } else {
        return res.status(200).json({ message: 'Acesso aos dados não permitido, não foi possível identificar o usuario requisitante.' });
    }
    //==== fim da identificação para requisição de dados ====

}


