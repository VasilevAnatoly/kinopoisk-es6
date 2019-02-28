import React from 'react';
import {
    Row, Col
} from 'reactstrap';

export default class MovieInfo extends React.PureComponent {
    render() {
        const { name, origin_name, year, rate, description } = this.props.movie;
        return (
            <Col lg={{ size: 8, offset: 0 }} md={6} sm={{ size: 12, offset: 0 }} xs={{ size: 12, offset: 0 }} className="text-center">
                <Row>
                    <Col md={6}>
                        <Row className="justify-content-center">
                            Название
                                    </Row>
                        <Row className="justify-content-center">
                            Оригинальное название
                                    </Row>
                        <Row className="justify-content-center">
                            Год выхода
                                    </Row>
                        <Row className="justify-content-center">
                            Рейтинг
                                    </Row>
                    </Col>
                    <Col md={6}>
                        <Row className="justify-content-center bold-font">
                            {name}
                        </Row>
                        <Row className="justify-content-center">
                            {origin_name}
                        </Row>
                        <Row className="justify-content-center">
                            {year}
                        </Row>
                        <Row className="justify-content-center bold-font">
                            {rate}
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="text-center" id="description" >{description}</Col>
                </Row>
            </Col>
        );
    }
}