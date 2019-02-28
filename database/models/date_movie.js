// Модель, описывающая промежуточную таблицу в БД для хранения позиции фильма в списке топ-250 на конкретную дату

module.exports = (sequelize, type) => {
    return sequelize.define('date_rate', {
        // Первичный ключ
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Позиция фильма в топ-250
        position: {
            type: type.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        // Foreign key на запись с фильмом в таблице фильмов
        movieId: {
            type: type.INTEGER,
            references: 'movie',
            referencesKey: 'id',
            allowNull: false
        },
        // Foreign key на запись с датой в таблице дат
        dateId: {
            type: type.INTEGER,
            references: 'date',
            referencesKey: 'id',
            allowNull: false
        },
    });
}