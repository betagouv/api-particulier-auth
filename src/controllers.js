import crypto from 'crypto';
import { isEmpty, isString } from 'lodash';

import { getConnection } from './database';

export const pingController = (req, res, next) => res.json('pong');

export const authorizeController = async (req, res, next) => {
  try {
    const apiKey = req.get('X-API-Key');

    if (!isString(apiKey)) {
      throw new Error('api key not found');
    }

    const databaseConnection = await getConnection();

    const hashedApiKey = crypto
      .createHash('sha512')
      .update(apiKey)
      .digest('hex');

    const token = await databaseConnection.findOne({
      hashed_token: hashedApiKey,
    });

    if (isEmpty(token)) {
      throw new Error('token not found');
    }

    return res.json(token);
  } catch (error) {
    next(error);
  }
};
