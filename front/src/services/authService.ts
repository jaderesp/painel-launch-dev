import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export class AuthService {
    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    static generateToken(userId: string): string {
        return jwt.sign({ userId }, SECRET_KEY, { expiresIn: EXPIRES_IN });
    }

    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (error) {
            return null;
        }
    }
}
