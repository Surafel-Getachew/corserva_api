import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './db/connection';

// routes
import items from './routes/items';
import orders from './routes/orders';

const env = process.env.NODE_ENV ?? 'development';
dotenv.config({ path: `.env.${env}` });

// Connect to MongoDB
const connectDB: () => Promise<void> = async () => {
  try {
    const connectionDetail = await connection.sync();
    console.log(`DB connected to ${connectionDetail.config.database}`);
  } catch (error) {
    console.log('Error connecting DB', error);
  }
};
try {
  connectDB();
} catch (error) {}

export const app: Express = express();
// const port = process.env.PORT ?? 5000;
const port = 5200;
// cors
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Express - TypeScript Server');
});

// built-in middleware for json
app.use(express.json());

// routes
app.use('/items', items);
app.use('/orders', orders);

export const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
