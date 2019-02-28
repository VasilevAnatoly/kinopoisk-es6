import {
    combineReducers
} from 'redux';
import movies from './apiMoviesStore';

const apiStore = {
    movies,
}

export default combineReducers(apiStore)