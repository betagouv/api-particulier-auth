import request from 'supertest';
import sinon from 'sinon';

import server from '../src/app';
import { cleanFixtures, loadFixtures, testToken } from './fixtures';
import * as apiScopes from '../src/providers/api-scopes';

const sandbox = sinon.sandbox.create();

describe('GET /api/auth/authorize', function() {
  beforeEach(async () => {
    sandbox
      .stub(apiScopes, 'getScopes')
      .resolves({ scopes: ['dgfip_avis_imposition', 'dgfip_adresse'] });
    await loadFixtures();
  });
  afterEach(async () => {
    sandbox.restore();
    await cleanFixtures();
  });

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
      .expect(200, {
        _id: '5bcf377663623910ae9a05ca',
        name:
          'Mairie de test - https://signup-staging.api.gouv.fr/api-particulier/1',
        email: 'test@test',
        scopes: ['dgfip_avis_imposition', 'dgfip_adresse'],
      });
  });
});

describe('GET /api/introspect', function() {
  beforeEach(async () => {
    sandbox
      .stub(apiScopes, 'getScopes')
      .resolves({ scopes: ['dgfip_avis_imposition', 'dgfip_adresse'] });
    await loadFixtures();
  });
  afterEach(async () => {
    sandbox.restore();
    await cleanFixtures();
  });

  // DEPRECATED: the apiKey is to be read from headers only
  it('should 200 with the FS name and scopes', () => {
    return request(server)
      .get(`/api/auth/authorize?token=${testToken}`)
      .expect('content-type', /json/)
      .expect(200, {
        _id: '5bcf377663623910ae9a05ca',
        name:
          'Mairie de test - https://signup-staging.api.gouv.fr/api-particulier/1',
        email: 'test@test',
        scopes: ['dgfip_avis_imposition', 'dgfip_adresse'],
      });
  });

  it('should return a xml with pong when asking for xml', () => {
    return request(server)
      .get('/api/auth/authorize')
      .set('x-api-key', testToken)
      .set('Accept', 'application/xml')
      .expect('content-type', /xml/)
      .expect(200, /result/);
  });
});
