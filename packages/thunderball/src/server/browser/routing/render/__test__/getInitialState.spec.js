import getInitialState, { getClientConfig } from '../getInitialState';

describe('getClientConfig', () => {
  it('should get the expected keys', () => {
    const state = getClientConfig({
      foo: 1234,
      clientConfigKeys: ['foo'],
    });
    expect(state.foo).toEqual(1234);
  });

  it('should get multiple keys', () => {
    const state = getClientConfig({
      foo: 1234,
      bar: 'abc',
      clientConfigKeys: ['foo', 'bar'],
    });
    expect(state.foo).toEqual(1234);
    expect(state.bar).toEqual('abc');
  });

  it('should not get unexpected keys', () => {
    const state = getClientConfig({
      foo: 1234,
      bar: 'abc',
      clientConfigKeys: ['foo'],
    });
    expect(state.bar).toBeUndefined();
  });

  it('should do nothing for keys that do not exist', () => {
    const state = getClientConfig({
      foo: 1234,
      bar: 'abc',
      clientConfigKeys: ['foo', 'baz'],
    });
    expect(state.foo).toEqual(1234);
    expect(state.bar).toBeUndefined();
    expect(state.baz).toBeUndefined();
  });
});

describe('getInitialState', () => {
  it('should return default state if no custom getInitialState methods are defined', async () => {
    const req = {
      headers: {
        host: 'localhost',
      },
      protocol: 'http',
      url: 'http://localhost',
    };
    const promise = getInitialState({}, req, false, {});
    await expect(promise).resolves.toEqual(
      { config: {}, device: { host: 'http://localhost' } });
  });
  it('should return default state with x-forwarded-proto over protocol', () => {
    const req = {
      headers: {
        host: 'localhost',
        'x-forwarded-proto': 'https',
      },
      protocol: 'http',
      url: 'http://localhost',
    };
    const promise = getInitialState({}, req, false, {});
    return expect(promise).resolves.toEqual(
      { config: {}, device: { host: 'https://localhost' } });
  });

  it('should use custom getInitialState from config.js', () => {
    const config = {
      ssr: {
        getInitialState: () => Promise.resolve({
          appConfig: 'abc',
        }),
      },
    };
    const req = {
      headers: {
        host: 'localhost',
        'x-forwarded-proto': 'https',
      },
      protocol: 'http',
      url: 'http://localhost',
    };
    const promise = getInitialState({}, req, false, config);
    return expect(promise).resolves.toEqual(
      { config: {}, device: { host: 'https://localhost' }, appConfig: 'abc' });
  });

  it('should use custom getInitialState from ion manifest', () => {
    const ssr = {
      getInitialState: () => Promise.resolve({
        manifest: 1234,
      }),
    };
    const req = {
      headers: {
        host: 'localhost',
        'x-forwarded-proto': 'https',
      },
      protocol: 'http',
      url: 'http://localhost',
    };
    const promise = getInitialState(ssr, req, false, {});
    return expect(promise).resolves.toEqual(
      { config: {}, device: { host: 'https://localhost' }, manifest: 1234 });
  });

  it('should use custom getInitialState from both config.js and ion manifest', () => {
    const config = {
      ssr: {
        getInitialState: () => Promise.resolve({
          appConfig: 'abc',
        }),
      },
    };
    const ssr = {
      getInitialState: () => Promise.resolve({
        manifest: 1234,
      }),
    };
    const req = {
      headers: {
        host: 'localhost',
        'x-forwarded-proto': 'https',
      },
      protocol: 'http',
      url: 'http://localhost',
    };
    const promise = getInitialState(ssr, req, false, config);
    return expect(promise).resolves.toEqual(
      { config: {}, device: { host: 'https://localhost' }, manifest: 1234, appConfig: 'abc' });
  });
  it('should ignore custom getInitialState that is not a function', () => {
    const ssr = {
      getInitialState: 123,
    };
    const req = {
      headers: {
        host: 'localhost',
        'x-forwarded-proto': 'https',
      },
      protocol: 'http',
      url: 'http://localhost',
    };
    const promise = getInitialState(ssr, req, false, {});
    return expect(promise).resolves.toEqual(
      { config: {}, device: { host: 'https://localhost' } });
  });
});
