import fetch from 'node-fetch';

function getHeadersObject(headers) {
  const headersObj = {};
  headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  return headersObj;
}

describe('homeIon', () => {
  describe('Get / (HomeView)', () => {
    it('returns the page', async () => {
      const response = await fetch('http://localhost:8000');
      expect(response).toHaveProperty('status', 200);
      const headers = getHeadersObject(response.headers);
      expect(headers).toMatchObject({
        connection: 'close',
        'content-encoding': 'gzip',
        'content-type': 'text/html; charset=utf-8',
        date: expect.anything(),
        etag: expect.anything(),
        'transfer-encoding': 'chunked',
        vary: 'Accept-Encoding',
        'x-powered-by': 'Thunderball',

      });
      expect(await response.text()).toMatchSnapshot();
    });
  });
});
