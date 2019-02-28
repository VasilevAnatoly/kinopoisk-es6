import React from 'react';
import { connect } from 'react-redux';
import {
    Row, Col, Modal, ModalHeader, ModalBody
} from 'reactstrap';

// Импорт вспомогательных компонентов для отображения данных о фильме
import MoviePreview from "./MoviePreview";
import MovieInfo from "./MovieInfo";
import MovieCommentCard from "./MovieCommentCard";
import MovieCommentForm from "./MovieCommentForm";

// Испортируем метод из списка actions для получения конкретного фильма
import { getMovieById } from 'kinopoisk/store/actions/apiActions/apiMoviesActions';

// Испортируем методы из списка actions для сохранения комментариев и лайков с помощью сокетов
import { addCommentToMovie, addMovieLikeDislike, addCommentLikeDislike } from 'kinopoisk/store/actions/socketActions';

class Movie extends React.Component {
    constructor(props) {
        super(props);

        //Инициализируем state компонента
        this.state = {
            movieId: window.location.pathname.slice(window.location.pathname.indexOf('movies/') + 7),
            author: '',
            comment: '',
            modal: false,
        }
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        //Отправляем запрос на сервер с помощью подключенного метода для получения информации о конкретном фильме
        this.props.getMovieById(this.state.movieId);
    }

    toggle() {
        //Показ/скрытие модального окна с сообщение об ошибке
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    onChange = (event) => {
        //Обработка ввода пользоваталем символов в текстовые поля формы
        this.setState({ [event.target.name]: event.target.value });
    }

    onMovieLikeDislikeClick = (like) => {
        //Отправка данных о новом лайке/дизлайке фильма через сокеты
        this.props.addMovieLikeDislike({
            movieId: this.state.movieId,
            like: like
        });
    }

    onCommentLikeDislikeClick = (commentId, like) => {
        //Отправка данных о новом лайке/дизлайке комментария через сокеты
        this.props.addCommentLikeDislike({
            commentId: commentId,
            like: like
        });
    }


    addComment = (e) => {
        // Обработка события отправки формы с новым комментарием пользователя к фильму
        e.preventDefault();
        e.stopPropagation();
        if (!this.state.author.trim().length || !this.state.comment.trim().length) {
            this.toggle();
        } else {
            //Отправка данных из формы на сервер
            this.props.addCommentToMovie(this.state);
            this.setState({
                author: '',
                comment: ''
            });
        }
    }

    render() {
        const movie = this.props.movieStore.movie;
        // Обрабокта ошибки, например, в случае ошибки 404
        if (!movie) {
            return (
                <Row>
                    <Col lg={{ size: 6, offset: 3 }} md={{ size: 6, offset: 3 }} sm={{ size: 6, offset: 3 }} xs={{ size: 6, offset: 3 }}>
                        Извините, но по вашему запросу ничего не найдено!</Col>
                </Row>
            );
        } else {
            return (
                <React.Fragment>
                    <Row>
                        {/* Отображение превью фильма с лайками/дизлайками */}
                        <MoviePreview
                            name={movie.name}
                            image={movie.image}
                            likes={movie.likes}
                            dislikes={movie.dislikes}
                            likeClick={this.onMovieLikeDislikeClick}
                        />
                        {/* Отображение информации о фильме - название, год выпуска, описание и тд */}
                        <MovieInfo movie={movie} />
                    </Row>
                    <Row className="comments-block">
                        {/* Отображение блока с комменатриями в виде отдельных карточек */}
                        <Col md={12} className="text-center bold-font">Комментарии</Col>
                        {
                            movie.comments && movie.comments.length ? movie.comments.map(comment => {
                                return (
                                    <MovieCommentCard
                                        comment={comment}
                                        likeClick={this.onCommentLikeDislikeClick}
                                    />
                                );
                            }) : <Col md={{ size: 6, offset: 3 }}>
                                    Пока еще нет ни одного комментария. Вы будете первым!
                            </Col>
                        }
                    </Row>
                    <Row style={{ marginTop: 30, marginBottom: 40 }}>
                        {/* Отображение формы для отправки комментария к фильму */}
                        <MovieCommentForm
                            author={this.state.author}
                            comment={this.state.comment}
                            onChange={this.onChange}
                            addComment={this.addComment}
                        />
                    </Row>
                    <Modal isOpen={this.state.modal} toggle={this.toggle}>
                        <ModalHeader toggle={this.toggle}>Ошибка</ModalHeader>
                        <ModalBody>
                            Пожалуйста, заполните обязательные поля!
                    </ModalBody>
                    </Modal>
                </React.Fragment>
            );
        }
    }

}

//Инициализируем сохранение в props компонента данных из store
const mapStateToProps = ({ apiStore }) => ({
    movieStore: apiStore.movies.movie
});

//Пробрасываем actions в props компонента
const mapActionCreators = {
    getMovieById,
    addCommentToMovie,
    addMovieLikeDislike,
    addCommentLikeDislike
};

export default connect(mapStateToProps, mapActionCreators)(Movie);