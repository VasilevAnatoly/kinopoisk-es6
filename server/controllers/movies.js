import controllers from '../../database/controllers';
const movies = controllers.movies;

// Получение информации из БД о топ-10 фильмах на выбранную дату
let getMovies = async (req, res) => {
    try {
        let moviesArray = await movies.getMovies(req.query.date);
        if (moviesArray.length) {
            res.status(200).send(moviesArray);
        } else {
            res.status(200).send([]);
        }
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving movies: " + error.message
        });
    }
}

// Получение информации из БД о конкретном фильме, включая комментарии
let getMovieById = async (req, res) => {
    try {
        let movie = await movies.getMovieById(req.params.movieId);
        if (movie) {
            res.status(200).send(movie);
        } else {
            res.status(404).send({
                message: `Could not find movie by id = ${req.params.movieId}`
            });
        }
    } catch (error) {
        res.status(500).send({
            message: `Error retrieving movie by id = ${req.params.movieId}: ` + error.message
        });
    }
}

module.exports = {
    getMovies,
    getMovieById,
};