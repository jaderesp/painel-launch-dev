import { Request, Response } from 'express';
//acessar variaveis ENV
import GamesService from '../services/GamesService';
import dotenv from 'dotenv';
dotenv.config();
const { BASE_URL, PORT } = process.env;


export const home = async (req: Request, res: Response) => {

    let session = req.session;

    return res.render('admin/home/index', { BASE_URL, session });

}

export const categorias = async (req: Request, res: Response) => {

    let session = req.session;

    return res.render('admin/categorias/index', { BASE_URL, session });

}

export const games = async (req: Request, res: Response) => {

    let session = req.session;

    return res.render('admin/games/index', { BASE_URL, session });

}

export const gamesTester = async (req: Request, res: Response) => {

    let session = req.session;
    let { id_game } = req.params;

    let param = {}
    let game = {}

    if (id_game) {
        game = await GamesService.getSomeOne({ id_game });
    }

    return res.render('admin/gamesTester/index', { BASE_URL, session, game });

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