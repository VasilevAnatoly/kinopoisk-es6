const controllers = require("../database/controllers");
const comments = controllers.comments;
const movies = controllers.movies;

// Функция для обработки сохранения в БД лайка/дизлайка у комментария
let addCommentLikeDislike = (data) => {
  const client = this;
  // Вызов функции сохранения данных В БД
  comments.newCommentLikeDislike(data.body.commentId, data.body.like)
    .then(() => {
      // Отправка события и данных клиенту, вызвавшему действие
      client.emit("newCommentLikeDislike", data.body);
      // Отправка события и данных всем остальным подключенным клиентам
      client.broadcast.emit("newCommentLikeDislike", data.body);
    })
    .catch(err => {
      console.log(err.message);
    });
}

// Функция для обработки сохранения в БД лайка/дизлайка у фильма
let addMovieLikeDislike = (data) => {
  const client = this;
  movies.newMovieLikeDislike(data.body.movieId, data.body.like)
    .then(() => {
      client.emit("newMovieLikeDislike", data.body);
      client.broadcast.emit("newMovieLikeDislike", data.body);
    })
    .catch(err => {
      console.log(err.message);
    });
}

// Функция для обработки сохранения в БД комментария к фильму
let addCommentToMovie = (data) => {
  const client = this;
  comments.addCommentToMovie(data.body.author, data.body.comment, data.body.movieId)
    .then(newComment => {
      let plainComment = newComment.get({
        plain: true
      });
      client.emit("newCommentToMovie", plainComment);
      client.broadcast.emit("newCommentToMovie", plainComment);
    })
    .catch(err => {
      console.log(err.message);
    });
}


module.exports = {
  addCommentLikeDislike,
  addMovieLikeDislike,
  addCommentToMovie
}