import React, { Component, Fragment } from 'react';
import { Container, InputGroup, Form, Button, BDiv } from 'bootstrap-4-react';
import UserList from './components/UserList'
import NavigationBar from './components/NavigationBar'

export default class App extends Component {
    render() {
        return (
            <Fragment>
                <BDiv bg="light">
                    <NavigationBar userName="Пользователь 1" />
                    <Container>
                        <InputGroup lg my="2">
                            <InputGroup.PrependText>Оценка</InputGroup.PrependText>
                            <Form.Input type="number" />
                        </InputGroup>
                        <Button primary lg my="2">Отправить</Button>
                        <UserList value="" />
                        <BDiv my="2">
                        <Button success lg >Вскрываемся</Button>
                        </BDiv>
                        <BDiv my="2">
                        <Button warning lg my="2">Очистить оценки</Button>
                        </BDiv>
                    </Container>
                </BDiv>
            </Fragment>
        )
    }
}