import { Request, Response, NextFunction } from 'express';

export const verificarSessao = (req: Request, res: Response, next: NextFunction) => {
    let userLogged = (Object.keys(req.session || {}).length > 0) ? true : false;
    if (!userLogged) {
        return res.status(401).json({ message: 'Não autorizado' });
    }

    next();
};
