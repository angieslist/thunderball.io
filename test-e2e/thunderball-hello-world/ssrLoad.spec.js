import fetch from 'node-fetch';

function normalizeText(text) {
  // normalize hashed assets
  return text.replace(/[\d\w]{7,}(?=\.js|\.css)/g, 'TEST-HASH')
    // normalize app version
    .replace(/appVersion":"\d+\.\d+\.\d+/, 'appVersion":"TEST-VERSION')
    // normalize data-react-checksum
    .replace(/-?\d{7,}/g, 'TEST-CHECKSUM');
}

describe('ssrLoad', () => {
  describe('Get page that uses ssrLoad', () => {
    it('returns the page', async () => {
      const response = await fetch('http://localhost:8000/todo-answers/server-fetch-example');
      expect(response).toHaveProperty('status', 200);
      const text = normalizeText(await response.text());
      expect(text).toMatchSnapshot();
    });
  });
});
