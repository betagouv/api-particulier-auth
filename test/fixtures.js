import { MongoClient } from 'mongodb';
import crypto from 'crypto';

export const testToken = '59eb9fddb23a05e8c82f922caf6c1733';

export const tokenFixtures = [
  {
    _id: '5bcf377663623910ae9a05ca',
    hashed: true,
    name:
      'Mairie de test - https://signup-staging.api.gouv.fr/api-particulier/1',
    email: 'test@test',
    scopes: ['dgfip_avis_imposition', 'dgfip_adresse'],
    hashed_token: crypto
      .createHash('sha512')
      .update(testToken)
      .digest('hex'),
  },
];

export const loadFixtures = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error(
      'NODE_ENV should be set to test (avoid wiping production database :) )'
    );
  }
  const mongoClient = await MongoClient.connect('mongodb://localhost:27017');
  await mongoClient
    .db('api-particulier-test')
    .collection('tokens')
    .insertMany(tokenFixtures);
  await mongoClient.close();
};

export const cleanFixtures = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error(
      'NODE_ENV should be set to test (avoid wiping production database :) )'
    );
  }
  const mongoClient = await MongoClient.connect('mongodb://localhost:27017');
  await mongoClient
    .db('api-particulier-test')
    .collection('tokens')
    .drop();
  await mongoClient.close();
};
