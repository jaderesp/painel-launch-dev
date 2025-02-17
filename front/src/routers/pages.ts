
import { Request, Response } from 'express';

export async function start(req: Request, res: Response) {


    try {


        res.status(200).json({
            result: 'success',
            session: "teste",
            state: 'STARTING',
            status: 'notLogged',
        });

    } catch (error: any) {
        return res.status(500).json({
            result: 500,
            status: 'FAIL',
            reason: error.message,
        });
    }



}