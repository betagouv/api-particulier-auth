import crypto from 'crypto';
import { isEmpty, isString } from 'lodash';

import { getDatabaseConnection } from './database';

export const pingController = (req, res, next) => res.json('pong');

export const authorizeController = async (req, res, next) => {
  try {
    const apiKey = req.get('X-API-Key');

    if (!isString(apiKey)) {
      throw new Error('API key not found');
    }

    const databaseConnection = await getDatabaseConnection();

    const hashedApiKey = crypto
      .createHash('sha512')
      .update(apiKey)
      .digest('hex');

    const token = await databaseConnection.collection('tokens').findOne(
      {
        hashed_token: hashedApiKey,
      },
      { projection: { _id: 1, name: 1, scopes: 1 } }
    );

    if (isEmpty(token)) {
      throw new Error('token not found');
    }

    return res.json(token);
  } catch (error) {
    next(error);
  }
};
