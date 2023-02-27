import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// routes
import items from './routes/items';
import orders from './routes/orders';

const env = process.env.NODE_ENV ?? 'development';
dotenv.config({ path: `.env.${env}` });

export const app: Express = express();
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

