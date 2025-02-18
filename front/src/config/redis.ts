
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  //password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
  console.error('Erro no Redis:', err);
});

(async () => {
  await redisClient.connect();
  console.log('🔌 Conectado ao Redis!');
})();

export default redisClient;

