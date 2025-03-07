
import { Request, Response } from 'express';
//acessar variaveis ENV
import dotenv from 'dotenv';
dotenv.config();
const { BASE_URL, PORT } = process.env;



export const verifySession = async (req: Request, res: Response) => {

    let userLogged = (Object.keys(req.session || {}).length > 0) ? true : false;

    if (userLogged) {
        return res.json({ loggedIn: true, session: userLogged });
    } else {
        return res.json({ loggedIn: false });
    }

};

// ✅ Rota de Logoff
export const logoff = (req: Request, res: Response) => {

    let userLogged = (Object.keys(req.session || {}).length > 0) ? true : false;
    // Verifica se há uma sessão ativa
    if (userLogged) {

        req.session.destroy((err) => {
            if (err) {
                console.error("Erro ao destruir a sessão:", err);
                return res.json({ loggedIn: userLogged, message: "Erro ao encerrar a sessão: " + err });
            }

            userLogged = (Object.keys(req.session || {}).length > 0) ? true : false;
            return res.json({ loggedIn: userLogged, message: "A sesão foi encerrada com sucesso." });
        });
    } else {
        return res.json({ loggedIn: userLogged, message: "Erro ao encerrar a sessão." });
    }
}