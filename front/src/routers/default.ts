
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