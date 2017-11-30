export default function notFoundHandler(req, res, next) {
  res.status(404).format({
    json() {
      res.send({ error: 'Resource not found' });
    },

    html() {
      res.send('<h1>404 Page Not Found</h1>');
    },

    default() {
      res.send('404 Resource not found');
    },
  });
}
