import request from 'supertest';

import server from '../src/app';
import {
  cleanFixtures,
  loadFixtures,
  testToken,
  tokenFixtures,
} from './fixtures';

describe('GET /api/auth/authorize', function() {
  beforeEach(loadFixtures);
  afterEach(cleanFixtures);

  it('should return 401 when no credentials are provided', () => {
    return request(server)
      .get('/api/auth/authorize')
      .expect(401);
  });

  it('should return a 401 when a wrong token is provided', () => {
    return request(server)
      .get('/api/auth/authorize')
      .set('x-api-key', 'wrong-token')
      .expect(401);
  });

  it('should 200 with the FS name and scopes', () => {
    return request(server)
      .get('/api/auth/authorize')
      .set('x-api-key', testToken)
      .expect(200)
      .expect(({ body: { _id, name, scopes } }) => {
        if (
          _id !== '5bcf377663623910ae9a05ca' ||
          name !== tokenFixtures[0].name ||
          scopes[0] !== tokenFixtures[0].scopes[0]
        ) {
          throw new Error('wrong token returned');
        }
      });
  });
});
