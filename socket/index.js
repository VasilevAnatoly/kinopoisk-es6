const controllers = require('./controllers');

// Конфигурируем подключение
module.exports = (io) => {
    io.on('connection', async function (client) {
        try {
            client.use((packet, next) => {
                const data = packet[1];
                if (typeof data === 'object' && data) {
                    const body = {};
                    for (const prop in data) {
                        if (data.hasOwnProperty(prop)) {
                            body[prop] = data[prop];
                            delete data[prop];
                        }
                    }
                    data.body = body;
                }
                return next();
            });

            //Вешаем обработчики на события, вызываемые на сервере с клиента
            client.on('addCommentLikeDislike', controllers.addCommentLikeDislike);
            client.on('addMovieLikeDislike', controllers.addMovieLikeDislike);
            client.on('addCommentToMovie', controllers.addCommentToMovie);
        } catch (e) {
            client.disconnect(true);
            console.log((e || {}).message || e);
        }
    });
    console.log(`Socket server is listening`);
}