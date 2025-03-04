import express, {Request, Response} from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

app.use(express.static(path.join(process.cwd(), '../client/dist')));

app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), '../client/dist/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
