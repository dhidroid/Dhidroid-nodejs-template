import mongoose from 'mongoose';
import { config } from './config';
import { logger } from './logger';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGO_URI);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};
