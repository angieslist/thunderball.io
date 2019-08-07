import { get, set } from '../cache';

describe('cache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Get and Set', () => {
    it('should send a falsey response on a cache miss', () => expect(get('test')).resolves.toBeFalsy());

    it('should resolve a promise on setting cache', () => expect(set('test', 'testValue')).resolves.toBeTruthy());

    it('should be a cache hit after setting', async () => {
      await set('cacheHit', true);
      const cacheValue = await get('cacheHit');
      expect(cacheValue).toBe(true);
    });
  });
});
