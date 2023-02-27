import { app } from './index';
import connection from './db/connection';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const connectDB: () => Promise<void> = (async () => {
  try {
    const connectionDetail = await connection.sync();
    console.log(`DB connected to ${connectionDetail.config.database}`);
  } catch (error) {
    console.log('Error connecting DB', error);
  }
})();

const start = (port: number) => {
  try {
    app.listen(port, () => {
      console.log(`Server is up and running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }
};
const port = 5200;
start(port);
