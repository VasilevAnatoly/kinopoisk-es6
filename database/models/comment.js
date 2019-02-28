// Модель, описывающая таблицу в БД для хранения комментариев

module.exports = (sequelize, type) => {
    return sequelize.define('comment', {
        // Первичный ключ
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Автор комментария
        author: {
            type: type.STRING,
            allowNull: false,
            defaultValue: ""
        },
        // Текст комментария
        comment: {
            type: type.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        // Количество лайков
        likes: {
            type: type.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        // Количество дизлайков
        dislikes: {
            type: type.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    });
}