import { Request, Response, NextFunction } from 'express';
import { getUserSession } from '../controllers/utils/Session';
import ConfiguracoesService from '../services/ConfiguracoesService';

export const identify = async (req: Request, res: Response, next: NextFunction) => {

    let user = getUserSession(req);

    try {

        //retornar somente dados refrente ao usuario logado
        let where = {}

        if (Object.keys(where).length == 0) {
            let { id_usr } = user ? ('id_usr' in user ? user : { id_usr: null }) : { id_usr: null };
            where = { id_usr }
        } else {
            return res.status(200).json({ messege: "Nenhum dado de configurações foi encontrado." })
        }

        next();

    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar dados referente ao usuario logado.', error });
    }



};
