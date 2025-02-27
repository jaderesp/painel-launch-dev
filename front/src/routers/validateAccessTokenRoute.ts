import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middlewares/accessToken';

const router = Router();

// Rota para verificar a validade do token
router.post('/validate-token', authenticateToken, (req: Request, res: Response) => {

    if ("user" in req) {

        return res.status(200).json({
            message: 'Token válido.',
            user: (req.user) ? req.user : '',  // Dados decodificados do token,
            valid: true
        });

    } else {

        return res.status(401).json({
            message: 'Token inválido ou expirado.',
            valid: false
        });

    }

});

export default router;
