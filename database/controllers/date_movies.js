const DateMovieEntity = require("../index").DateMovieEntity;

// Функия для сохранения в БД информации о позициях фильмов на конкретные даты
let createDateMovies = (dateMoviesArray) => {
    return new Promise((resolve, reject) => {
        DateMovieEntity.bulkCreate(dateMoviesArray, {
                returning: true
            })
            .then((dateMovies) => {
                resolve(dateMovies);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

module.exports = {
    createDateMovies
};