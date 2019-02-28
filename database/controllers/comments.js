const CommentEntity = require("../index").CommentEntity;

// Функция для сохранения в БД нового комментария к фильму
let addCommentToMovie = (author, comment, movieId) => {
    return CommentEntity.create({
        author: author,
        comment: comment,
        movieId: movieId
    }, {
        raw: true,
    });
}

let newCommentLikeDislike = (commentId, like) => {
    return CommentEntity.increment(like === "like" ? 'likes' : 'dislikes', {
        where: {
            id: commentId
        }
    });
}

module.exports = {
    addCommentToMovie,
    newCommentLikeDislike
};