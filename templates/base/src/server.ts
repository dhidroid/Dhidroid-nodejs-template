import app from './app';
import { config } from './config/config';
import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import { logger } from './config/logger';

const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();

        // Connect to Redis
        await connectRedis();

        app.listen(config.PORT, () => {
            logger.info(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
        });
    } catch (error) {
        logger.error(`Error starting server: ${(error as Error).message}`);
        process.exit(1);
    }
};

startServer();
