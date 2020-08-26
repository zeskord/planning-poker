import React, { useState } from 'react';
import { Container, InputGroup, Form, Button } from 'bootstrap-4-react';

export const LoginForm = (props) => {

    var userName = ""
    var isSpectator = false

    const [state, setState] = useState({
        userName: "",
        isSpectator: false
    });

    async function loginclick() {
        const reqBody = {
            userName: state.userName,
            isSpectator: state.isSpectator
        }
        const result = await fetch("/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(reqBody)
        })
        const userData = await result.json()
        props.setAuthState(userData, true)
    }

    function loginKeyUp(event) {
        if (event.keyCode === 13) {
            loginclick()
        }
    }

    function userNameChange(event) {

        userName = event.target.value
        setState(prev => {
            return {
                ...prev,
                userName: userName
            }
        })
    }


    function isSpectatorChange(event) {

        isSpectator = event.target.value
        setState(prev => {
            return {
                ...prev,
                isSpectator: isSpectator
            }
        })
    }

    return (
        <Container>
            <InputGroup>
                <label htmlFor="userName">Введите ваше имя</label>
            </InputGroup>
            <InputGroup mb="3">
                <Form.Input lg type="text" id="userName" value={state.userName} onChange={userNameChange}
                    onKeyUp={loginKeyUp} placeholder="Имя пользователя" />
            </InputGroup>
            <Form.Check mb="3">
                <Form.CheckInput type="checkbox" id="isSpectator" value={state.isSpectator} onChange={isSpectatorChange} />
                <Form.CheckLabel htmlFor="isSpectator">Я только посмотреть</Form.CheckLabel>
            </Form.Check>
            <InputGroup mb="3">
                <Button primary onClick={loginclick}>Войти</Button>
            </InputGroup>
        </Container >
    )

}