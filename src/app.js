import express from 'express';
import fs from 'fs';
import morgan from 'morgan';

import { authorizeController, pingController } from './controllers';

const app = express();

const logger = morgan('combined', {
  stream: fs.createWriteStream(
    process.env.ACCESS_LOG_PATH || './api-particulier-auth.log',
    { flags: 'a' }
  ),
});

app.use(logger);

app.get('/api/ping', pingController);
app.get('/api/auth/authorize', authorizeController);

app.use(function(err, req, res, next) {
  console.error(err);
  res.sendStatus(401);
});

const port = process.env.PORT || '7000';
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export default server;
