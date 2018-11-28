import thunderballMiddleware from '../thunderballMiddleware';

describe('thunderballMiddleware', () => {
  it('sets x-powered-by response header', () => {
    const req = {};
    const res = {
      setHeader: jest.fn(),
    };
    const next = jest.fn();
    thunderballMiddleware(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith('X-Powered-By', 'Thunderball');
    expect(next).toHaveBeenCalled();
  });
});
