import { MongoClient } from 'mongodb';

let mongodbConnection = null;

const user = encodeURIComponent(
  process.env.API_SCOPES_USER || 'api-particulier'
);
const password = encodeURIComponent(
  process.env.API_SCOPES_PASSWORD || 'api-particulier'
);
const dbUrl =
  process.env.API_SCOPES_DATABASE_URL ||
  'scopes-development.api.gouv.fr:27017/scopes';

const url = `mongodb://${user}:${password}@${dbUrl}?authMechanism=DEFAULT`;

const getApiScopesConnection = async () => {
  if (mongodbConnection && mongodbConnection.isConnected()) {
    return mongodbConnection.db('scopes');
  }

  mongodbConnection = await MongoClient.connect(url);

  console.log(`Connected to database : mongodb://${user}@${dbUrl}`);

  return mongodbConnection.db('scopes');
};

export const getScopes = async clientId => {
  const apiScopesConnection = await getApiScopesConnection();

  return await apiScopesConnection.collection('scopes').findOne({
    client_id: clientId,
    provider: 'api-particulier',
  });
};
