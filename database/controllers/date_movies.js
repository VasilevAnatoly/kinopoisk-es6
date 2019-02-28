const DateMovieEntity = require("../index").DateMovieEntity;

// Функия для сохранения в БД информации о позициях фильмов на конкретные даты
let createDateMovies = async (dateMoviesArray) => {
    return await DateMovieEntity.bulkCreate(dateMoviesArray, {
        returning: true
    });
}

module.exports = {
    createDateMovies
};