import React from 'react';
import { withRouter } from "react-router-dom";

class Header extends React.PureComponent {

    // Метод для обработки клика по иконке с лого или надписи для перехода на страницу с таблицей
    handleClick = () => {
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="navbar justify-content-end" style={{ padding: 0 }}>
                <div className="navbar-header" style={{ marginTop: 20 }} onClick={(e) => {
                    this.handleClick();
                }}>
                    <img src="/favicon.ico" alt="КиноПоиск" />
                    КиноПоиск | Топ 250 фильмов
                </div>
            </div>
        )
    }
}

export default withRouter(Header);