const CommentEntity = require("../index").CommentEntity;

// Функция для сохранения в БД нового комментария к фильму
let addCommentToMovie = async (author, comment, movieId) => {
    return await CommentEntity.create({
        author: author,
        comment: comment,
        movieId: movieId
    }, {
        raw: true,
    });
}

let newCommentLikeDislike = async (commentId, like) => {
    return await CommentEntity.increment(like === "like" ? 'likes' : 'dislikes', {
        where: {
            id: commentId
        }
    });
}

module.exports = {
    addCommentToMovie,
    newCommentLikeDislike
};