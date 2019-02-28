import express from 'express';
import history from 'connect-history-api-fallback';
import http from "http";
import socket from 'socket.io';
import fs from 'fs';
import cookieParser from 'cookie-parser';

const app = express();

// middleware для обработки 404 ошибки
app.use(history({
    index: '/kinopoisk.html'
}));

const server = http.createServer(app);
const io = socket(server);
import logger from './libs/log';
const log = logger(module);
import paths from './paths.js';

// Инициализация Express
import initExpress from './init/express.js';

// Инициализация рутов на сервере
import initRoutes from './routes';

//Инициализация подключения сокетов
import initSocket from '../socket';

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