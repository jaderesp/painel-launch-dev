
import { Request, Response } from 'express';
//acessar variaveis ENV
import dotenv from 'dotenv';
dotenv.config();
const { BASE_URL, PORT } = process.env;

export const home = async (req: Request, res: Response) => {

    console.log("teste")
    return res.render('home/index');

}

export const login = async (req: Request, res: Response) => {
    //passar paramentros para a pagina de login

    return res.render('login/index', { BASE_URL, PORT });

}

export const verifySession = async (req: Request, res: Response) => {

    let userLogged = (Object.keys(req.session || {}).length > 0) ? true : false;

    if (userLogged) {
        return res.json({ loggedIn: true, session: userLogged });
    } else {
        return res.json({ loggedIn: false });
    }

};