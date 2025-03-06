import { Request, Response } from 'express';
//acessar variaveis ENV
import dotenv from 'dotenv';
dotenv.config();
const { BASE_URL, PORT } = process.env;


export const categorias = async (req: Request, res: Response) => {

    let session = req.session;
    return res.render('reseller/categorias/index', { BASE_URL, session });

}

export const home = async (req: Request, res: Response) => {
    let session = req.session;
    return res.render('reseller/home/index', { BASE_URL, session });

}

export const login = async (req: Request, res: Response) => {
    //passar paramentros para a pagina de login

    return res.render('reseller/login/index', { BASE_URL, PORT });

}

export const perfil = async (req: Request, res: Response) => {
    let session = req.session;
    return res.render('reseller/perfil/index', { BASE_URL, session });

}