import express from 'express';
import controllers from '../controllers/';

const movies = controllers.movies;

const router = express.Router();

// Определение обработчика и рута для отправки топ-10 фильмов
router.route('/')
    .get(movies.getMovies);

// Определение обработчика и рута для отправки данных о фильме
router.route('/:movieId').get(movies.getMovieById);

module.exports = router;