const DateEntity = require("../index").DateEntity;

// Функция для сохранения в БД информации о сразу нескольких датах
let createDates = (datesArray) => {
    return new Promise((resolve, reject) => {
        let dates = [];
        datesArray.forEach(date => {
            dates.push({
                date: date
            });
        });
        DateEntity.bulkCreate(dates, {
                returning: true
            })
            .then((dates) => {
                resolve(dates);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

module.exports = {
    createDates
};