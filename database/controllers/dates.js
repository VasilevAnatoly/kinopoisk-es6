const DateEntity = require("../index").DateEntity;

// Функция для сохранения в БД информации о сразу нескольких датах
let createDates = async (datesArray) => {
    let dates = [];
    datesArray.forEach(date => {
        dates.push({
            date: date
        });
    });
    return await DateEntity.bulkCreate(dates, {
        returning: true
    });
}

module.exports = {
    createDates
};