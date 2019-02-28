import {
    kinoRequestTypes,
    socketTypes
} from '../../constants';

import {
    combineReducers
} from 'redux';

const initialMovies = {
    loading: false,
    loaded: false,
    errors: null,
    movies: [],
};

const initialMovie = {
    loading: false,
    loaded: false,
    errors: null,
    movie: null,
};


// Store для хранения информации о топ-10 фильмах на выбранную пользователем дату
function topMovies(state = initialMovies, {
    type,
    data,
    errors
}) {
    switch (type) {
        case kinoRequestTypes.GET_TOP_MOVIES_BY_DATE_REQUEST:
            return {
                ...state,
                loading: true,
                loaded: false,
                errors: null,
            }
        case kinoRequestTypes.GET_TOP_MOVIES_BY_DATE_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                errors: null,
                movies: data
            }
        case kinoRequestTypes.GET_TOP_MOVIES_BY_DATE_FAIL:
            return {
                ...state,
                loading: false,
                loaded: true,
                errors: errors ? errors : null,
            }
        default:
            return state;
    }
}

// Store для хранения информации о конкретном фильме и обработки поступления нового комментария к фильму или лайка/дизлайка
function movie(state = initialMovie, {
    type,
    data,
    errors
}) {
    switch (type) {
        case kinoRequestTypes.GET_MOVIE_BY_ID_REQUEST:
            return {
                ...state,
                loading: true,
                loaded: false,
                errors: null,
            }
        case kinoRequestTypes.GET_MOVIE_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                errors: null,
                movie: data
            }
        case kinoRequestTypes.GET_MOVIE_BY_ID_FAIL:
            return {
                ...state,
                loading: false,
                loaded: true,
                movie: null,
                errors: errors ? errors : null,
            }
        case socketTypes.NEW_COMMENT_TO_MOVIE:
            if (data.movieId === state.movie.id.toString()) {
                let comments = state.movie.comments.slice();
                comments.push(data);
                state.movie.comments = comments;
            }
            return {
                ...state,
            }
        case socketTypes.NEW_MOVIE_LIKE_DISLIKE:
            if (data.movieId === state.movie.id.toString()) {
                data.like === "like" ? state.movie.likes++ : state.movie.dislikes++;
            }
            return {
                ...state,
            }
        case socketTypes.NEW_COMMENT_LIKE_DISLIKE:
            let comment = state.movie.comments.find(comment => {
                return comment.id === data.commentId;
            });
            if (comment) {
                data.like === "like" ? comment.likes++ : comment.dislikes++;
            }
            return {
                ...state,
            }
        default:
            return state;
    }
}

const movies = {
    topMovies,
    movie
}

export default combineReducers(movies);