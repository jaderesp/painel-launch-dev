import { Request, Response } from 'express';
//acessar variaveis ENV
import dotenv from 'dotenv';
dotenv.config();
const { BASE_URL, PORT } = process.env;


export const categorias = async (req: Request, res: Response) => {

    console.log("teste")
    return res.render('admin/categorias/index');

}

export const home = async (req: Request, res: Response) => {

    console.log("teste")
    return res.render('admin/home/index');

}

export const login = async (req: Request, res: Response) => {
    //passar paramentros para a pagina de login

    return res.render('admin/login/index', { BASE_URL, PORT });

}