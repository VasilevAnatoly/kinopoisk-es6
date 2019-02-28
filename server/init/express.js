// Подключение необходимых библиотек

import bodyParser from 'body-parser';
import gzip from 'compression';
import helmet from 'helmet';
import cors from 'cors';

module.exports = (app) => {
    app.use(gzip());
    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
};