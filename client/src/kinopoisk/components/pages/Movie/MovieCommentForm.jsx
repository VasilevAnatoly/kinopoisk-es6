//Компонент для отображения формы с вводом комментария

import React from 'react';
import {
    Col, Button, Form, FormGroup, Label, Input
} from 'reactstrap';

export default class MovieCommentForm extends React.Component {
    render() {
        const { author, comment } = this.props;
        return (
            <Col md={{ size: 6, offset: 3 }}>
                <Col md={12} className="text-center bold-font" style={{ marginBottom: 20 }}>Оставить комментарий</Col>
                <Form autoComplete="off" onSubmit={(e) => this.props.addComment(e)}>
                    <FormGroup>
                        <Label for="author">Имя <span className="asterisk">*</span></Label>
                        <Input
                            type="text"
                            name="author"
                            value={author}
                            id="author"
                            placeholder="Введите ваше имя"
                            onChange={(e) => {
                                this.props.onChange(e);
                            }} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="comment">Комментарий <span className="asterisk">*</span></Label>
                        <Input
                            type="textarea"
                            name="comment"
                            value={comment}
                            id="comment"
                            placeholder="Введите ваш комментарий"
                            onChange={(e) => {
                                this.props.onChange(e);
                            }} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="comment"><span className="asterisk">*</span> - поля, обязательные для заполнения</Label>
                    </FormGroup>
                    <Button color="primary">Отправить</Button>
                </Form>
            </Col>
        );
    }
}