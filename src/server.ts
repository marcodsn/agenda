import 'reflect-metadata';
import { AppDataSource } from './database/dataSource';
import app from './app';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during Data Source initialization', error);
  }
}

startServer();