const expect = require('chai').expect
const Service = require('../scope.service')
const testData = require('./mongo.json')
const mongo = require('../../lib/utils/mongo')

describe('Scope service', () => {
  let service

  beforeEach(() => {
    return mongo.connect().then(() => {
      service = new Service()
      return service.initialize().then((service) => {
        return service.collection.insertMany(testData.data.map((data) => Object.assign({}, data)))
      })
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
