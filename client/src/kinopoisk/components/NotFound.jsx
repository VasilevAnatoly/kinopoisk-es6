import React from 'react';
import {
    Row, Col
} from 'reactstrap';

export default class NotFound extends React.PureComponent {
    render() {
        return (
            <Row>
                <Col lg={{ size: 6, offset: 3 }} md={{ size: 6, offset: 3 }} sm={{ size: 6, offset: 3 }} xs={{ size: 6, offset: 3 }}>
                    Извините, но по вашему запросу ничего не найдено!</Col>
            </Row>
        );
    }
}