import sanitize from 'mongo-sanitize';
import { ObjectID } from 'mongodb';

import { getDatabaseConnection } from '../providers/database';
import { getScopes } from '../providers/api-scopes';
import { getNewApiKey, hashApiKey } from '../utils/api-key';

const signupHost =
  process.env.SIGNUP_HOST || 'https://signup-development.api.gouv.fr';

export const getTokenList = async (req, res, next) => {
  try {
    const databaseConnection = await getDatabaseConnection();

    const tokenList = await databaseConnection
      .collection('tokens')
      .find()
      .toArray();

    return res.render('token-list', { tokenList });
  } catch (e) {
    next(e);
  }
};

export const getTokenDetail = async (req, res, next) => {
  try {
    const databaseConnection = await getDatabaseConnection();

    const token = await databaseConnection
      .collection('tokens')
      .findOne({ _id: ObjectID(req.params.id) });

    const { scopes } = await getScopes(req.params.id);

    return res.render('token-detail', {
      token: {
        ...token,
        scopes,
      },
      tokenToString: JSON.stringify(
        {
          ...token,
          scopes,
        },
        null,
        2
      ),
      signupHost,
    });
  } catch (e) {
    next(e);
  }
};

export const updateToken = async (req, res, next) => {
  try {
    const databaseConnection = await getDatabaseConnection();

    const { value: token } = await databaseConnection
      .collection('tokens')
      .findOneAndUpdate(
        { _id: ObjectID(req.params.id) },
        {
          $set: {
            name: sanitize(req.body.name),
            email: sanitize(req.body.email),
          },
        },
        { returnOriginal: false }
      );

    return res.render('token-detail', {
      token,
      tokenToString: JSON.stringify(token, null, 2),
      signupHost,
    });
  } catch (e) {
    next(e);
  }
};

export const createToken = async (req, res, next) => {
  try {
    const databaseConnection = await getDatabaseConnection();

    if (!req.body.name || !req.body.email || !req.body.signup_id) {
      return res.sendStatus(400);
    }

    const insertResult = await databaseConnection
      .collection('tokens')
      .insertOne({
        name: sanitize(req.body.name),
        email: sanitize(req.body.email),
        signup_id: sanitize(req.body.signup_id),
      });

    const newToken = insertResult.ops[0];

    return res.json(newToken);
  } catch (e) {
    next(e);
  }
};

export const generateNewApiKey = async (req, res, next) => {
  try {
    const databaseConnection = await getDatabaseConnection();

    const token = await databaseConnection
      .collection('tokens')
      .findOne({ _id: ObjectID(req.params.id) });

    if (token.hashed_token) {
      return next(
        new Error('You cannot generate a new token if you already have one')
      );
    }

    const newApiKey = getNewApiKey();

    const hashedApiKey = hashApiKey(newApiKey);

    const { value: newToken } = await databaseConnection
      .collection('tokens')
      .findOneAndUpdate(
        { _id: ObjectID(req.params.id) },
        { $set: { hashed_token: hashedApiKey } },
        { returnOriginal: false }
      );

    return res.render('token-detail', {
      token: newToken,
      tokenToString: JSON.stringify(newToken, null, 2),
      newlyGeneratedToken: newApiKey,
      signupHost,
    });
  } catch (e) {
    next(e);
  }
};
