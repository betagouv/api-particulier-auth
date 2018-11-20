import request from 'supertest';

import server from '../src/app';
import { cleanFixtures, loadFixtures } from './fixtures';

describe('GET /api/ping', () => {
  beforeEach(loadFixtures);
  afterEach(cleanFixtures);

  it('should return a json with pong', () => {
    return request(server)
      .get('/api/ping')
      .expect('content-type', /json/)
      .expect(200, '"pong"');
  });

  it('should return a json with pong even when asking for xml', () => {
    return request(server)
      .get('/api/ping')
      .set('Accept', 'application/xml')
      .expect('content-type', /json/)
      .expect(200, /pong/);
  });

  it('should return a json with pong even when forcing for xml', () => {
    return request(server)
      .get('/api/ping')
      .query({ format: 'xml' })
      .expect('content-type', /json/)
      .expect(200, /pong/);
  });

  it('should return a 404 when asking for an undefined route', function() {
    return request(server)
      .get('/api/not-existing')
      .expect(404);
  });
});
