import React from 'react';
import { connect } from 'react-redux';
import { connectToSocket } from 'kinopoisk/store/actions/socketActions';
import { Container } from 'reactstrap'

import Header from "./Header"

class App extends React.Component {

    // Отправляет запрос на подключение к серверу через сокеты
    componentDidMount() {
        this.props.connectToSocket();
    }

    render() {
        if (this.props.onlyChild) {
            return this.props.children
        } else {
            return (
                <Container>
                    {/* Отображаем header  */}
                    <Header />
                    <div style={{ marginTop: 20 }}>
                        {/* Отображаем компоненты с таблицей фильмов или конкретным фильмом */}
                        {this.props.children}
                    </div>
                </Container>
            )
        }
    }
}

// Пробрасываем action-ы в props компонента
const mapActionCreators = {
    connectToSocket
};

export default connect(null, mapActionCreators)(App);