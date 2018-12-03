import { MongoClient } from 'mongodb';

let mongodbConnection = null;

const dbUrl = encodeURIComponent(
  process.env.API_SCOPES_DOMAIN_NAME || 'scopes-development.api.gouv.fr'
);
const dbName = encodeURIComponent(
  process.env.API_SCOPES_DATABASE_NAME || 'scopes'
);
const dbPort = encodeURIComponent(
  process.env.API_SCOPES_DATABASE_PORT || '27017'
);
const user = encodeURIComponent(
  process.env.API_SCOPES_USER || 'api-particulier'
);
const password = encodeURIComponent(
  process.env.API_SCOPES_PASSWORD || 'api-particulier'
);

const url = `mongodb://${user}:${password}@${dbUrl}:${dbPort}/${dbName}?authMechanism=DEFAULT`;

const getApiScopesConnection = async () => {
  if (mongodbConnection && mongodbConnection.isConnected()) {
    return mongodbConnection.db(dbName);
  }

  mongodbConnection = await MongoClient.connect(url);

  console.log(
    `Connected to database : mongodb://${user}@${dbUrl}:${dbPort}/${dbName}`
  );

  return mongodbConnection.db(dbName);
};

export const getScopes = async clientId => {
  const apiScopesConnection = await getApiScopesConnection();

  return await apiScopesConnection.collection('scopes').findOne({
    client_id: clientId,
    provider: 'api-particulier',
  });
};
