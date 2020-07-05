import React, { Component } from 'react';
import { Container, InputGroup, Form, Button } from 'bootstrap-4-react';

export default class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            isSpectator: false
        }

        this.loginclick = this.loginclick.bind(this)
        this.userNameChange = this.userNameChange.bind(this)
        this.isSpectatorChange = this.isSpectatorChange.bind(this)
    }

    async loginclick() {
        const reqBody = {
            userName: this.state.userName,
            isSpectator: this.state.isSpectator
        }
        const result = await fetch("/", {
            method: "post",
            body: reqBody
        })
        console.log(result)
    }

    userNameChange(event) {
        this.setState({ userName: event.target.value });
    }

    isSpectatorChange(event) {
        this.setState({ isSpectator: event.target.value });
    }

    render() {
        return (
            <Container>
                <InputGroup>
                    <label htmlFor="userName">Введите ваше имя</label>
                </InputGroup>
                <InputGroup mb="3">
                    <Form.Input lg type="text" id="userName" value={this.state.userName} onChange={this.userNameChange} placeholder="Имя пользователя" />
                </InputGroup>
                <Form.Check mb="3">
                    <Form.CheckInput type="checkbox" id="isSpectator" value={this.state.isSpectator} onChange={this.isSpectatorChange} />
                    <Form.CheckLabel htmlFor="isSpectator">Я только посмотреть</Form.CheckLabel>
                </Form.Check>
                <InputGroup mb="3">
                    <Button primary onClick={this.loginclick}>Войти</Button>
                </InputGroup>
            </Container >
        )
    }
}