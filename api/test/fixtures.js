const {MongoClient} = require('mongodb');
const crypto = require('crypto');

const testToken = '59eb9fddb23a05e8c82f922caf6c1733';

const tokenFixtures = [{
  "_id" : "5bcf377663623910ae9a05ca",
  "hashed" : true,
  "name" : "Mairie de test - https://signup-staging.api.gouv.fr/api-particulier/1",
  "email" : "test@test",
  "scopes" : [ "dgfip_avis_imposition", "dgfip_adresse" ],
  "hashed_token" : crypto.createHash('sha512').update(testToken).digest('hex')
}]

const loadFixtures = async () => {
  if (process.env.NODE_ENV !== 'test') {throw new Error('for security reason, NODE_ENV should be set to test')}
  mongoClient = await MongoClient.connect('mongodb://localhost:27017');
  await mongoClient.db('api-particulier-test').collection('tokens').insertMany(tokenFixtures);
  await mongoClient.close()
}

const cleanFixtures = async () => {
  if (process.env.NODE_ENV !== 'test') {throw new Error('for security reason, NODE_ENV should be set to test')}
  mongoClient = await MongoClient.connect('mongodb://localhost:27017');
  await mongoClient.db('api-particulier-test').collection('tokens').drop();
  await mongoClient.close()
}

module.exports = {testToken, tokenFixtures, loadFixtures, cleanFixtures}
