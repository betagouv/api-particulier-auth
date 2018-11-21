import express from 'express';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import expressHandlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import { authorizeController, pingController } from './api/controllers';
import {
  createToken,
  generateNewApiKey,
  getTokenDetail,
  getTokenList,
  updateToken,
} from './admin/controllers';

const app = express();

// Configure logger
const logger = morgan('combined', {
  stream: fs.createWriteStream(
    process.env.ACCESS_LOG_PATH || './api-particulier-auth.log',
    { flags: 'a' }
  ),
});
app.use(logger);

// Register Handlebars view engine and setup handlebars folders
app.set('views', path.join(__dirname, 'admin/views'));
app.engine(
  'handlebars',
  expressHandlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'admin/views/layouts'),
    partialsDir: path.join(__dirname, 'admin/views/partials'),
  })
);
app.set('view engine', 'handlebars');

// Api router
const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/ping', pingController);
apiRouter.get('/auth/authorize', authorizeController);

apiRouter.use(function(err, req, res, next) {
  console.error(err);
  res.sendStatus(401);
});

// Admin router
const adminRouter = express.Router();
app.use('/admin', adminRouter);

// TODO add oauth2 authentication here
adminRouter.use(helmet());

adminRouter.get('/', getTokenList);
adminRouter.get('/token/:id', getTokenDetail);
adminRouter.post('/token/:id/generate-new-api-key', generateNewApiKey);
adminRouter.post(
  '/token/:id',
  bodyParser.urlencoded({ extended: false }),
  updateToken
);

// TODO add /api somehow for this endpoint
adminRouter.post(
  '/token/',
  bodyParser.json(),
  // TODO add token authentication here
  createToken
);

adminRouter.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).render('error', { error: err.toString() });
});

const port = process.env.PORT || '7000';
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export default server;
