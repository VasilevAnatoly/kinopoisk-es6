// Подключение необходимых библиотек

var bodyParser = require('body-parser');
var gzip = require('compression');
var helmet = require('helmet');
var cors = require('cors');

module.exports = (app) => {
    app.use(gzip());
    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
};