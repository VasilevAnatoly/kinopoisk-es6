// Логирование сообщений об ошибках

const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    label,
    printf
} = format;

const myFormat = printf(info => {
    const parsingObject = [];

    function parseMessage(msg, offset = '', nameProps = '', countIterate = 0) {
        let string = nameProps;
        if (Array.isArray(msg)) {
            if (nameProps)
                string += ':  [';
            else
                string += '['
            let isEmpty = true;
            let arrayString = '';
            for (let i = 0; i < msg.length; i++) {
                isEmpty = false;
                const childOffset = offset + '  ';
                if (i >= 100) {
                    arrayString += `${childOffset}... ${msg.length-i} more items\n`
                    break;
                } else {
                    arrayString += childOffset + parseMessage(msg[i], childOffset);
                    arrayString += ',\n'
                }
            }
            if (isEmpty) {
                string += ']';
            } else {
                string += '\n' + arrayString + offset + ']';
            }
        } else if (
            (msg ?
                ((typeof msg.toString === 'function') ?
                    msg.toString.toString() :
                    Object.toString.toString()
                ) :
                Object.toString.toString()
            ) !== Object.toString.toString()) {

            if (nameProps)
                string += ':  ' + msg.toString();
            else
                string += msg.toString();
        } else if (typeof msg === 'object' && msg) {
            if (nameProps)
                string += ':  {';
            else
                string += '{'
            let isParsing = false;
            for (var i = 0; i < parsingObject.length; i++) {
                if (parsingObject[i].object === msg) {
                    const objectString = parsingObject[i].string.replace(/\n/g, `\n${offset}`);
                    string += objectString + '}'
                    isParsing = true;
                    break;
                }
            }
            if (!isParsing) {
                let noOffsetString = '';
                if (countIterate < 10) {
                    let isEmpty = true;
                    let objectString = ''
                    for (const prop in msg) {
                        if (prop) {
                            const childOffset = offset + '  ';
                            const tempStr = parseMessage(msg[prop], childOffset, prop, countIterate + 1);
                            noOffsetString += '  ' + tempStr;
                            objectString += childOffset + tempStr;
                            objectString += ',\n';
                            noOffsetString += ',\n';
                            isEmpty = false
                        }
                    }
                    if (isEmpty) {
                        noOffsetString += '...';
                        string += '}';
                    } else {
                        noOffsetString = '\n' + noOffsetString;
                        string += '\n' + objectString + offset + '}';
                    }
                } else {
                    noOffsetString = '...';
                    string += '...}';
                }
                parsingObject.push({
                    string: noOffsetString,
                    object: msg
                });
            }
        } else if (typeof msg === 'function') {
            if (nameProps)
                string += ':  [function]'
            else
                string += '[function]'
        } else {
            if (nameProps)
                string += `:  ${msg}`;
            else
                string += `${msg}`
        }
        return string;
    }

    const message = parseMessage(info.message, '  ');

    return ` [${info.label}] \n ${info.level}: ${message} \n `;
});

function getLogger(module) {
    return createLogger({
        transports: [
            new transports.File({
                level: 'info',
                format: combine(
                    label({
                        label: getFilePath(module)
                    }),
                    myFormat
                ),
                filename: process.cwd() + '/logs/info.log',
                handleException: true,
                json: true,
                maxSize: 5242880, //5mb
                maxFiles: 2,
                colorize: false
            }),
            new transports.File({
                level: 'debug',
                format: combine(
                    label({
                        label: getFilePath(module)
                    }),
                    myFormat
                ),
                filename: process.cwd() + '/logs/debug.log',
                handleException: true,
                json: true,
                maxSize: 5242880, //5mb
                maxFiles: 2,
                colorize: false
            }),
            new transports.File({
                level: 'error',
                format: combine(
                    label({
                        label: getFilePath(module)
                    }),
                    myFormat
                ),
                filename: process.cwd() + '/logs/error.log',
                handleException: true,
                json: true,
                maxSize: 5242880, //5mb
                maxFiles: 2,
                colorize: false
            }),
            new transports.File({
                level: 'warning',
                format: combine(
                    label({
                        label: getFilePath(module)
                    }),
                    myFormat
                ),
                filename: process.cwd() + '/logs/warning.log',
                handleException: true,
                json: true,
                maxSize: 5242880, //5mb
                maxFiles: 2,
                colorize: false
            }),
            new transports.Console({
                level: 'debug',
                format: combine(
                    format.colorize(),
                    label({
                        label: getFilePath(module)
                    }),
                    myFormat
                ),
                handleException: true,
                json: false,
            })
        ],
        exitOnError: false
    });
}

function getFilePath(module) {
    //отобразим метку с именем файла, который выводит сообщение
    return module.filename.split('/').slice(-2).join('/');
}

module.exports = getLogger;