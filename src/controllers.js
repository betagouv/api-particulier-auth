import crypto from 'crypto';
import { isEmpty, isString } from 'lodash';

import { getDatabaseConnection } from './database';
import { getScopes } from './api-scopes';

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
      { projection: { _id: 1, name: 1 } }
    );

    if (isEmpty(token)) {
      throw new Error('token not found');
    }

    const scopes = await getScopes(token._id.toString());

    if (isEmpty(scopes)) {
      throw new Error('scopes not found');
    }

    return res.json({
      _id: token._id,
      name: token.name,
      scopes: scopes.scopes,
    });
  } catch (error) {
    next(error);
  }
};
