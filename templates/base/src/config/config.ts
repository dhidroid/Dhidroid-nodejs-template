import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    MONGO_URI: z.string().url(),
    JWT_SECRET: z.string().min(10),
    REDIS_URL: z.string().url(),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables', _env.error.format());
    throw new Error('Invalid environment variables');
}

export const config = {
    PORT: parseInt(_env.data.PORT, 10),
    NODE_ENV: _env.data.NODE_ENV,
    MONGO_URI: _env.data.MONGO_URI,
    JWT_SECRET: _env.data.JWT_SECRET,
    REDIS_URL: _env.data.REDIS_URL,
    LOG_LEVEL: _env.data.LOG_LEVEL,
};
