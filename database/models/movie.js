// Модель, описывающая таблицу в БД для хранения фильмов

module.exports = (sequelize, type) => {
    return sequelize.define('movie', {
        // Первичный ключ
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Название фильма (на русском)
        name: {
            type: type.STRING,
            allowNull: false,
            defaultValue: ""
        },
        // оригинальное название фильма
        origin_name: {
            type: type.STRING,
            allowNull: false,
            defaultValue: ""
        },
        // Описание фильма
        description: {
            type: type.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        // Путь к превью фильма в папке public/previes на сервере
        image: {
            type: type.STRING,
            allowNull: false,
            defaultValue: ""
        },
        // Год выхода фильма
        year: {
            type: type.INTEGER,
        },
        // Рейтинг фильма на КиноПоиске
        rate: {
            type: type.FLOAT,
            defaultValue: 0.0,
            allowNull: false,
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
        },
    });
}