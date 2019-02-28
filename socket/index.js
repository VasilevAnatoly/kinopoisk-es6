import controllers from './controllers';

// Конфигурируем подключение
module.exports = (io) => {
    io.on('connection', (client) => {
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
            client.on('addCommentLikeDislike', controllers(client).addCommentLikeDislike);
            client.on('addMovieLikeDislike', controllers(client).addMovieLikeDislike);
            client.on('addCommentToMovie', controllers(client).addCommentToMovie);
        } catch (e) {
            client.disconnect(true);
            console.log((e || {}).message || e);
        }
    });
    console.log(`Socket server is listening`);
}