import React, { useState } from 'react';
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import FormCheck from "react-bootstrap/FormCheck";
import FormCheckInput from "react-bootstrap/FormCheckInput";
import FormCheckLabel from "react-bootstrap/FormCheckLabel";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

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
        const userDataFromServer = await result.json()
        const userData = {
            userName: userDataFromServer.name,
            isAuthenticated: true
        }
        props.setAuthState(userData)
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
            <InputGroup className="mb-3">
                <FormControl
                placeholder="Введите ваше имя"
                aria-label="Username"
                aria-describedby="basic-addon1"
                size="lg"
                type="text"
                id="userName"
                value={state.userName}
                onChange={userNameChange}
                onKeyUp={loginKeyUp}
                />
            </InputGroup>

            <FormCheck className="mb-3">
                <FormCheckInput
                type="checkbox"
                id="isSpectator"
                value={state.isSpectator}
                onChange={isSpectatorChange}
                />
                <FormCheckLabel htmlFor="isSpectator">Я только посмотреть</FormCheckLabel>
            </FormCheck>
            <InputGroup className="mb-3">
                <Button variant="primary" onClick={loginclick}>Войти</Button>
            </InputGroup>
            {/* <InputGroup>
                <label htmlFor="userName">Введите ваше имя</label>
            </InputGroup>
            <InputGroup className="mb-3">
                <Form.Input size="lg" type="text" id="userName" value={state.userName} onChange={userNameChange}
                    onKeyUp={loginKeyUp} placeholder="Имя пользователя" />
            </InputGroup>
            <FormCheck className="mb-3">
                <Form.CheckInput type="checkbox" id="isSpectator" value={state.isSpectator} onChange={isSpectatorChange} />
                <Form.CheckLabel htmlFor="isSpectator">Я только посмотреть</Form.CheckLabel>
            </FormCheck>
            <InputGroup className="mb-3">
                <Button variant="primary" onClick={loginclick}>Войти</Button>
            </InputGroup> */}
        </Container >
    )

}