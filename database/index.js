require('dotenv').config();
const Sequelize = require('sequelize');
const CommentModel = require('./models/comment');
const DateModel = require('./models/date');
const MovieModel = require('./models/movie');
const DateMovieModel = require('./models/date_movie');

// Конфигурируем подключение к БД
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Определяем модели для хранения данных в таблицах
const DateEntity = DateModel(sequelize, Sequelize);
const CommentEntity = CommentModel(sequelize, Sequelize);
const MovieEntity = MovieModel(sequelize, Sequelize);
const DateMovieEntity = DateMovieModel(sequelize, Sequelize);

// Определяем соотношения между таблицами и моделями
MovieEntity.hasMany(CommentEntity);

MovieEntity.belongsToMany(DateEntity, {
    through: DateMovieEntity,
    foreignKey: "movieId"
});

DateEntity.belongsToMany(MovieEntity, {
    through: DateMovieEntity,
    foreignKey: "dateId"
});

// Подключаемся к БД
sequelize.sync({
        force: false
    })
    .then(() => {
        console.log(`Database & tables created!`)
    });

module.exports = {
    DateEntity,
    CommentEntity,
    MovieEntity,
    DateMovieEntity
}