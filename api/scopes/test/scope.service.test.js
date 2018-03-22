const expect = require('chai').expect
const Service = require('../scope.service')
const testData = require('./mongo.json')

describe('Db Token service', () => {
  const url = 'mongodb://localhost:27017/test-api-particulier'
  const service = new Service({mongoDbUrl: url})
  beforeEach(() => {
    return service.initialize().then((service) => {
      return service.collection.insertMany(testData.data)
    })
  })

  afterEach(() => {
    return service.collection.remove()
  })

  it('initializes with a collection', () => {
    expect(service.collection).not.to.equal(undefined)
  })

  it('gets all scopes', () => {
    return service.all().then((scopes) => {
      return expect(scopes).to.deep.equal(testData.data)
    })
  })
})
