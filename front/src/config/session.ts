import session from 'express-session';
import { RedisStore } from 'connect-redis';
import redisClient from './redis';
import dotenv from 'dotenv';

dotenv.config();

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Defina como `true` se estiver usando HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hora
  },
});

export default sessionMiddleware;
