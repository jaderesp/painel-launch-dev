import { Request, Response } from 'express';
//acessar variaveis ENV
import dotenv from 'dotenv';
dotenv.config();
const { BASE_URL, PORT } = process.env;


export const categorias = async (req: Request, res: Response) => {

    let session = req.session;
    if (!("user" in session)) {
        return res.redirect('/admin');
    }
    return res.render('admin/categorias/index', { BASE_URL, session });

}

export const home = async (req: Request, res: Response) => {

    let session = req.session;

    return res.render('admin/home/index', { BASE_URL, session });

}

export const login = async (req: Request, res: Response) => {
    //passar paramentros para a pagina de login
    return res.render('admin/login/index', { BASE_URL, PORT });

}

export const usuarios = async (req: Request, res: Response) => {
    //passar paramentros para a pagina de login
    let session = req.session;

    return res.render('admin/usuarios/index', { BASE_URL, PORT, session });

}