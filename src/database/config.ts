import { DataSourceOptions } from 'typeorm';

export const dbConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'agenda-db',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/entities/**/*.js'],
    migrations: ['src/migrations/**/*.ts'],
    synchronize: true, // Set to true for development, false for production
    dropSchema: true,  // Set to false in production!
    logging: process.env.NODE_ENV === 'development',
};