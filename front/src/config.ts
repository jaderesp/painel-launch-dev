import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { cleanEnv, num, str } from 'envalid';

expand(config({ path: `.env` }));
expand(config({ path: `.env.local` }));
expand(config({ path: `.env.${process.env.NODE_ENV || 'development'}` }));
expand(config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` }));
expand(config());

const env = cleanEnv(process.env, {
    NODE_ENV: str({ default: 'development' }),
    PORT: num({ default: 3000 }),
    HOST: str({ default: '' }),
    TOKEN: str({ default: '' }),
    IP_ADDRESS: str({ default: '' }),
    FRONTEND_CHAT_URL: str({ default: '' }),
    BASE_URL: str({ default: '' }),
    UPLOAD_FILES_DIR: str({ default: '' }),
    PUBLIC_FILES_DIR: str({ default: '' }),
});

export const { NODE_ENV, PORT, HOST, FRONTEND_CHAT_URL, TOKEN, IP_ADDRESS, UPLOAD_FILES_DIR, BASE_URL, PUBLIC_FILES_DIR } = env;
