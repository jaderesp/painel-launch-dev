import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer Token

    if (!token) {
        return res.status(401).json({ error: "Acesso negado, token não fornecido." });
    }

    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
        return res.status(403).json({ error: "Token inválido ou expirado." });
    }

    (req as any).userId = decoded.userId;
    next();
}
