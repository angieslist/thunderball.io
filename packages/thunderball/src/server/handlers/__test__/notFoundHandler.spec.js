import notFoundHandler from '../notFoundHandler';

describe('notFoundHandler', () => {
  let res;
  let formatter;
  beforeEach(() => {
    res = {
      format: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    notFoundHandler(null, res, null);
    formatter = res.format.mock.calls[0][0];
  });
  it('sends 404 response status', () => {
    expect(res.status).toHaveBeenCalledWith(404);
  });
  it('supports JSON response format', () => {
    formatter.json();
    expect(res.send).toHaveBeenCalledWith({
      error: 'Resource not found',
    });
  });
  it('supports HTML response format', () => {
    formatter.html();
    expect(res.send).toHaveBeenCalledWith('<h1>404 Page Not Found</h1>');
  });
  it('supports default text response format', () => {
    formatter.default();
    expect(res.send).toHaveBeenCalledWith('404 Resource not found');
  });
});
