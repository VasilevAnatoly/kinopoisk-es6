var express = require('express');
var history = require('connect-history-api-fallback');
const app = express();

// middleware для обработки 404 ошибки
app.use(history({
    index: '/kinopoisk.html'
}));

const server = require('http').createServer(app);
const io = require('socket.io')(server);
var fs = require('fs');
var log = require('./libs/log')(module);
var cookieParser = require('cookie-parser');
var paths = require('./paths.js')

// Инициализация Express
var initExpress = require('./init/express.js');

// Инициализация рутов на сервере
var initRoutes = require('./routes');

//Инициализация подключения сокетов
var initSocket = require('../socket');

const port = process.env.PORT || 3000;

// Создание папки для хранения превью фильмов
let createFolder = (path) => {
    if (!fs.existsSync(path))
        fs.mkdirSync(path);
}

createFolder(paths.moviePreviewsPath);

initExpress(app);
initRoutes(app);
initSocket(io);

app.use(cookieParser('kinopoisk'));
app.use(express.static(paths.publicPath));
app.use('/static', express.static('public/static'));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404);
    log.debug(req.method + '\n' + res.statusCode + '\n' + req.url);
    res.json({
        error: 'Not found'
    });
    return;
});

// Error handlers
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    log.error(req.method + '\n' + res.statusCode + '\n' + err.message);
    res.json({
        error: err.message
    });
    return;
});

try {
    server.listen(port, () => {
        log.info('Server is up and running on port: ' + port);
    });
} catch (e) {
    log.error('Server \n Не удалось запустить на порту: ' + port +
        ' - он либо используется, либо у вас нет разрешения');
}