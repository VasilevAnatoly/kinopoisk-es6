// Модель, описывающая таблицу в БД для хранения дат, для которых есть статистика по фильмам

module.exports = (sequelize, type) => {
    return sequelize.define('date', {
        // Первичный ключ
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Дата
        date: {
            type: type.DATEONLY,
            allowNull: false,
        }
    });
}