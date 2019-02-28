//Определение констант для действий, передаваемых через сокеты

let apiSocket = 'http://localhost:3000';
// ========= SOCKETS CONSTANTS BEGIN =========
export const SOCKET_CONNECT = 'SOCKET_CONNECT';

// Определение типов действий, вызываемых на клиенте для передачи информации на сервер
export const SOCKET_ADD_COMMENT_TO_MOVIE = 'SOCKET_ADD_COMMENT_TO_MOVIE';
export const SOCKET_ADD_MOVIE_LIKE_DISLIKE = 'SOCKET_ADD_MOVIE_LIKE_DISLIKE';
export const SOCKET_ADD_COMMENT_LIKE_DISLIKE = 'SOCKET_ADD_COMMENT_LIKE_DISLIKE';

// Определение типов действий, вызываемых на сервере для передачи информации на клиент
export const NEW_COMMENT_TO_MOVIE = 'NEW_COMMENT_TO_MOVIE';
export const NEW_MOVIE_LIKE_DISLIKE = 'NEW_MOVIE_LIKE_DISLIKE';
export const NEW_COMMENT_LIKE_DISLIKE = 'NEW_COMMENT_LIKE_DISLIKE';
export const SOCKET_URL = apiSocket;
// ========= SOCKETS CONSTANTS END =========
export const EVENT_TO_TYPE = {
	newMovieLikeDislike: NEW_MOVIE_LIKE_DISLIKE,
	newCommentLikeDislike: NEW_COMMENT_LIKE_DISLIKE,
	newCommentToMovie: NEW_COMMENT_TO_MOVIE
}