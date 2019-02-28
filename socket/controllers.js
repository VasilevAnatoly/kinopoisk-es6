import controllers from "../database/controllers";
const comments = controllers.comments;
const movies = controllers.movies;

module.exports = (client) => {
  // Функция для обработки сохранения в БД лайка/дизлайка у комментария
  let addCommentLikeDislike = async (data) => {
    try {
      // Вызов функции сохранения данных В БД
      await comments.newCommentLikeDislike(data.body.commentId, data.body.like);
      // Отправка события и данных клиенту, вызвавшему действие
      client.emit("newCommentLikeDislike", data.body);
      // Отправка события и данных всем остальным подключенным клиентам
      client.broadcast.emit("newCommentLikeDislike", data.body);
    } catch (error) {
      console.log(error.message);
    }
  }

  // Функция для обработки сохранения в БД лайка/дизлайка у фильма
  let addMovieLikeDislike = async (data) => {
    try {
      await movies.newMovieLikeDislike(data.body.movieId, data.body.like);
      client.emit("newMovieLikeDislike", data.body);
      client.broadcast.emit("newMovieLikeDislike", data.body);
    } catch (error) {
      console.log(error.message);
    }
  }

  // Функция для обработки сохранения в БД комментария к фильму
  let addCommentToMovie = async (data) => {
    try {
      let newComment = await comments.addCommentToMovie(data.body.author, data.body.comment, data.body.movieId);
      let plainComment = newComment.get({
        plain: true
      });
      client.emit("newCommentToMovie", plainComment);
      client.broadcast.emit("newCommentToMovie", plainComment);
    } catch (error) {
      console.log(error.message);
    }
  }
  return {
    addCommentLikeDislike,
    addMovieLikeDislike,
    addCommentToMovie
  }
}