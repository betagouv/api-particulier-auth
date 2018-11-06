import { MongoClient } from 'mongodb';

let connection = null;

const url = 'mongodb://localhost:27017';
const dbName =
  process.env.NODE_ENV !== 'test' ? 'api-particulier' : 'api-particulier-test';

export const getConnection = async () => {
  if (connection && connection.isConnected()) {
    return connection.db(dbName).collection('tokens');
  }

  connection = await MongoClient.connect(url);

  console.log(`Connected to database : ${url}/${dbName}`);

  return connection.db(dbName).collection('tokens');
};
