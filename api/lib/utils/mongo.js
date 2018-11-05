const {MongoClient} = require('mongodb')

class Mongo {
  async connect () {
    this.client = await MongoClient.connect('mongodb://localhost:27017' || 'mongodb://localhost', {
      reconnectTries: 1
    })

    const mongoDatabase = process.env.NODE_ENV !== 'test' ? 'api-particulier' : 'api-particulier-test';
    this.db = this.client.db(mongoDatabase)
  }

  async disconnect (force) {
    return this.client.close(force)
  }
}

module.exports = new Mongo()
