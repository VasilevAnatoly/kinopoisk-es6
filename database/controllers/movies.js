const MovieEntity = require("../index").MovieEntity;
const DateEntity = require("../index").DateEntity;
const CommentEntity = require("../index").CommentEntity;
const DateMovieEntity = require("../index").DateMovieEntity;

// Получение информации из БД о топ-10 фильмах на выбранную дату
let getMovies = async (date) => {
    return await MovieEntity.findAll({
        limit: 10,
        attributes: ['id', 'name', 'origin_name', 'year', 'rate'],
        include: [{
            model: DateEntity,
            where: {
                date: date
            },
            attributes: ["id"],
            through: {
                attributes: ['position'],
            },
        }],
        order: [
            [DateEntity, DateMovieEntity, 'position', 'ASC']
        ]
    });
}

// Получение информации из БД о конкретном фильме, включая комментарии
let getMovieById = async (movieId) => {
    return await MovieEntity.findOne({
        where: {
            id: movieId
        },
        include: [{
            model: CommentEntity
        }]
    });
}

// Сохранение нового лайка/дизлайка у фильма в БД
let newMovieLikeDislike = async (movieId, like) => {
    return await MovieEntity.increment(like === "like" ? 'likes' : 'dislikes', {
        where: {
            id: movieId
        }
    });
}

// Функция для сохранения в БД информации о сразу нескольких фильмах
let createMovies = async (moviesArray) => {
    return await MovieEntity.bulkCreate(moviesArray, {
        returning: true
    });
}

module.exports = {
    getMovies,
    getMovieById,
    newMovieLikeDislike,
    createMovies
};