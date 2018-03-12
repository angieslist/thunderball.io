import request from 'supertest';

describe('main - app', () => {
  let server;

  beforeEach(() => {
    server = require('../main');
  });

  afterEach(() => {
    server.close();
  });

  it('sends 404 response for nonexistent route', async () => {
    const response = await request(server).get('/not-a-page');
    expect(response).toHaveProperty('status', 404);
    expect(JSON.parse(response.text)).toMatchSnapshot();
  });

  it('sets response headers', async () => {
    const response = await request(server).get('/not-a-page');
    expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
    expect(response.headers).toHaveProperty('x-powered-by', 'Thunderball');
    expect(response.headers).toHaveProperty('etag');
  });
});
