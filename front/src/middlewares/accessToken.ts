import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'minha_chave_secreta';

// Middleware para verificar o token JWT
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    if (token) {
        try {
            const decoded = jwt.verify(token.toString(), SECRET_KEY);
            Object.assign(req, { user: decoded }) // Adiciona os dados do token à requisição para uso futuro
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido ou expirado.', valid: false });
        }

    } else if (!token) {
        return res.status(403).json({ message: 'Token não fornecido.', valid: false });
    }

};
