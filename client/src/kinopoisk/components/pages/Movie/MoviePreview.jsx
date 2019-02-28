import React from 'react';
import {
    Row, Col, Label
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

export default class MoviePreview extends React.Component {
    render() {
        return(
            <Col lg={{ size: 4, offset: 0 }} md={{ size: 4, offset: 0 }} sm={{ size: 6, offset: 3 }} xs={{ size: 6, offset: 3 }}>
                            <Row>
                                <Col md={{ size: 10, offset: 1 }}>
                                    <img src={this.props.image} alt={this.props.name} width="180" height="270" />
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col md={{ size: 10, offset: 1 }}>
                                    <Label className="like-label">{this.props.likes}</Label>
                                    <FontAwesomeIcon
                                        icon={faThumbsUp}
                                        className="like-label"
                                        onClick={(e) => {
                                            this.props.likeClick("like");
                                        }}
                                    />
                                    <Label className="like-label">{this.props.dislikes}</Label>
                                    <FontAwesomeIcon
                                        icon={faThumbsDown}
                                        className="like-label"
                                        onClick={(e) => {
                                            this.props.likeClick("dislike");
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
        );
    }
}