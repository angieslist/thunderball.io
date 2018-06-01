import fetch from 'node-fetch';

function normalizeText(text) {
  // normalize hashed assets
  return text.replace(/[\d\w]{7,}(?=\.js|\.css)/g, 'TEST-HASH')
    // normalize app version
    .replace(/appVersion":"\d+\.\d+\.\d+/, 'appVersion":"TEST-VERSION')
    // normalize data-react-checksum
    .replace(/-?\d{7,}/g, 'TEST-CHECKSUM');
}

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
      const text = normalizeText(await response.text());
      expect(text).toMatchSnapshot();
    });
  });
});
