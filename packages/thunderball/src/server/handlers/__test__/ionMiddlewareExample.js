module.exports = (/* config, ions, app */) => (req, res, next) => {
  if (req.method === 'GET' && req.path.toLowerCase() === '/hello') {
    res.send(200, {
      message: 'Hello World',
    });
  }
  next();
};
