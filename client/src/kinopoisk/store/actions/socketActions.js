import {
  socketTypes
} from 'kinopoisk/store/constants';

// Действие для подключения клиента к серверу
export function connectToSocket(actionId) {
  return {
    type: socketTypes.SOCKET_CONNECT,
  };
}

// Действие для добавления лайка/дизлайка к фильму через сокеты
export function addMovieLikeDislike(data) {
  return {
    // Определение типа действия
    type: socketTypes.SOCKET_ADD_MOVIE_LIKE_DISLIKE,
    socket: {
      emit: 'addMovieLikeDislike',
      // Передача данных
      data: data
    }
  };
}

// Действие для добавления лайка/дизлайка к комментарию через сокеты
export function addCommentLikeDislike(data) {
  return {
    type: socketTypes.SOCKET_ADD_COMMENT_LIKE_DISLIKE,
    socket: {
      emit: 'addCommentLikeDislike',
      data: data
    }
  };
}

// Действие для добавления комментария к фильму через сокеты
export function addCommentToMovie(data) {
  return {
    type: socketTypes.SOCKET_ADD_COMMENT_TO_MOVIE,
    socket: {
      emit: 'addCommentToMovie',
      data: data
    }
  };
}