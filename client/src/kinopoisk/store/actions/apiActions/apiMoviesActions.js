import {
  kinoRequestTypes,
  kinoApi
} from '../../constants';

// Определение действия для запроса с сервера статистики по фильмам на текущую дату
export function getMovies(params) {
  return {
    // Определение типа действия
    type: kinoRequestTypes.GET_TOP_MOVIES_BY_DATE,
    request: {
      method: 'get',
      // Подстановка рута
      url: kinoApi.API_URL_MOVIES,
      // Передача параметров - выбранной пользователем даты
      params: params
    }
  };
}

// Определение действия для запроса с сервера информации по фильму
export function getMovieById(movieId) {
  return {
    // Определение типа действия
    type: kinoRequestTypes.GET_MOVIE_BY_ID,
    request: {
      method: 'get',
      url: kinoApi.API_URL_MOVIES + `/${movieId}`,
    },
  };
}