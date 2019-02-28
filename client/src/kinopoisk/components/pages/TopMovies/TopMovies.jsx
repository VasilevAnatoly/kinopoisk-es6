import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';

// Испортируем метод из списка actions для получения топ-10 фильмов на выбранную дату
import { getMovies } from 'kinopoisk/store/actions/apiActions/apiMoviesActions';

class TopMovies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            year: '',
            filteredMovies: null
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            filteredMovies: nextProps.topMovies.movies,
        });

    }

    // Возвращаем текущую дату в формате yyyy-mm-dd
    getCurrentDate() {
        var d = new Date();
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    }

    // Обработка выбора пользователем даты
    onСhangeDateClick = (val) => {
        const value = val.target ? val.target.value : val;
        this.setState({
            date: value
        });
    };

    onСhangeYearClick = (val) => {
        const value = parseInt(val.target ? val.target.value : val);
        if (value) {
            let filteredMovies = this.props.topMovies.movies.slice();
            filteredMovies = filteredMovies.filter(movie => {
                return movie.year.toString().startsWith(value.toString());
            });
            this.setState({
                year: value,
                filteredMovies: filteredMovies
            });
        }
        else {
            this.setState({
                year: '',
                filteredMovies: this.props.topMovies.movies.slice()
            });
        }
    }


    // Обработка нажатия пользователем кнопки "Найти" для оправки запроса на сервер с конкретной датой
    findMovies(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.getMovies({
            date: this.state.date
        });
    }

    // Отправка запроса на сервер с дефолтной датой (сегодняшней) и инициализация поля date в state компонента
    componentDidMount() {
        const date = this.getCurrentDate();
        this.props.getMovies({
            date: date
        });
        this.setState({
            date: date
        });
    }

    render() {
        // const movies = this.props.topMovies.movies;
        const movies = this.state.filteredMovies;
        return (
            <React.Fragment>
                <Row id="dateform">
                    <Col md={6}>
                        <Form inline autoComplete="off" onSubmit={(e) => this.findMovies(e)}>
                            <FormGroup>
                                <Label for="date" style={{ marginRight: 20 }}>Дата</Label>
                                <Input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={this.state.date}
                                    placeholder="Выберите дату"
                                    onChange={(e) => {
                                        this.onСhangeDateClick(e);
                                    }}
                                />
                                <Button color="primary">Найти</Button>
                            </FormGroup>
                        </Form>
                    </Col>
                    <Col md={{ size: 6 }}>
                        <Form inline style={{ float: "right" }}>
                            <FormGroup>
                                <Label for="date" style={{ marginRight: 20 }}>Год</Label>
                                <Input
                                    type="text"
                                    name="year"
                                    id="year"
                                    value={this.state.year}
                                    placeholder="Введите год"
                                    onChange={(e) => {
                                        this.onСhangeYearClick(e);
                                    }}
                                />
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
                <Table striped bordered hover responsive className="text-center">
                    <thead>
                        <tr>
                            <th>N</th>
                            <th>Название</th>
                            <th>Оригинальное название</th>
                            <th>Год выхода</th>
                            <th>Рейтинг</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Отображаем таблицу с фильмами или выводим строку с сообщением, если фильмы не были найдены на выбранную дату */}
                        {movies && movies.length ? movies.map(movie => {
                            return (
                                <tr key={movie.id}>
                                    <td>{movie.dates[0].date_rate.position}</td>
                                    <td>
                                        <Link to={'/movies/' + movie.id} href='javascript:void(0)'>
                                            {movie.name}
                                        </Link>
                                    </td>
                                    <td>{movie.origin_name}</td>
                                    <td>{movie.year}</td>
                                    <td>{movie.rate}</td>
                                </tr>
                            );
                        }) : <tr>
                                <td colSpan="5">Ничего не найдено</td>
                            </tr>}
                    </tbody>
                </Table>
            </React.Fragment >
        );
    }
}

//Инициализируем сохранение в props компонента данных из store
const mapStateToProps = ({ apiStore }) => ({
    topMovies: apiStore.movies.topMovies,
});

//Пробрасываем actions в props компонента
const mapActionCreators = {
    getMovies
};


export default connect(mapStateToProps, mapActionCreators)(withRouter(TopMovies));