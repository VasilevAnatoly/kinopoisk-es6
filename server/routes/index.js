import htmlRoutes from './html';
import apiMovies from './apiMovies';

module.exports = (app) => {
  app.all('/*', function (req, res, next) {
    // Определение заголовков запроса
    if (req.method === 'OPTIONS') {
      var headers = {};
      // IE8 does not allow domains to be specified, just the *
      // headers["Access-Control-Allow-Origin"] = req.headers.origin;
      headers["Access-Control-Allow-Origin"] = "*";
      headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
      headers["Access-Control-Allow-Credentials"] = false;
      headers["Access-Control-Max-Age"] = '86400'; // 24 hours
      headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
      res.writeHead(200, headers);
      res.end();
    } else next();
  });

  // Инициализация рутов
  app.use('/', htmlRoutes);
  app.use('/api/movies', apiMovies);
};