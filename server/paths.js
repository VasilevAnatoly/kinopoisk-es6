const path = require('path');

// Определение константы с путем до папки с превью фильмов
const publicPath = path.join(process.cwd(), '/public');
const moviePreviewsPath = path.join(publicPath, '/previews');

module.exports = {
    publicPath: publicPath,
    moviePreviewsPath: moviePreviewsPath,
}