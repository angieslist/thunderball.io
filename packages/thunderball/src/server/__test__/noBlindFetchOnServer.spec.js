import 'isomorphic-fetch';
import '../noBlindFetchOnServer';

describe('noBlindFetchOnServer', () => {
  it('should prevent execution a fetch call', () => {
    const promise = fetch('http://localhost:1');

    // Since there is nothing running on localhost:1, if we dont fail,
    // then assume noBlindFetchOnServer returned an empty Result and didnt run
    return expect(promise).resolves.toBeDefined();
  });

  it('should allow execution a fetch call if allowOnServer is set', () => {
    const promise = fetch('http://localhost:1', { allowOnServer: true });

    // Since there is nothing running on localhost:1, if we  fail,
    // then assume noBlindFetchOnServer ran but was rejected
    return expect(promise).rejects.toBeDefined();
  });
});
