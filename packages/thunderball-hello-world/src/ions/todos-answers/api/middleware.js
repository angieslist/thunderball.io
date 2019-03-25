import jsonServer from 'json-server';
import path from 'path';

const router = jsonServer.router(path.join(__dirname, 'db.json'));

export default function middleware(config, ions, app) {
  app.use('/api', router);
}
