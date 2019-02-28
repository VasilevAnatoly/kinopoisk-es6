//Компонент для отображения карточки комментария

import React from 'react';
import {
    Col, Label, Card, CardText, CardBody,
    CardTitle
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'

export default class MovieCommentCard extends React.Component {
    render() {
        const comment = this.props.comment;
        return (
            <Col md={6} key={comment.id} className="comment-card">
                <Card>
                    <CardBody>
                        <CardTitle>
                            {comment.author}
                            <div className="comment-likes-block">
                                <Label className="like-label">{comment.likes}</Label>
                                <FontAwesomeIcon
                                    icon={faThumbsUp}
                                    className="like-label"
                                    onClick={(e) => {
                                        this.props.likeClick(comment.id, "like");
                                    }}
                                />
                                <Label className="like-label">{comment.dislikes}</Label>
                                <FontAwesomeIcon
                                    icon={faThumbsDown}
                                    className="like-label"
                                    onClick={(e) => {
                                        this.props.likeClick(comment.id, "dislike");
                                    }}
                                />
                            </div>
                        </CardTitle>
                        <CardText>{comment.comment}</CardText>
                    </CardBody>
                </Card>
            </Col>
        );
    }
}