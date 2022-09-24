import React, { useState } from 'react';

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
        const result = await fetch("/api/login", {
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
      <div className="container-sm mt-2">
        <div className="input-group mb-3">
          <input
            class="form-control form-control-lg"
            placeholder="Введите ваше имя"
            aria-label="Username"
            aria-describedby="basic-addon1"
            type="text"
            id="userName"
            value={state.userName}
            onChange={userNameChange}
            onKeyUp={loginKeyUp}
          />
        </div>

        <div className="input-group mb-3">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="isSpectator"
              value={state.isSpectator}
              onChange={isSpectatorChange}
            />
            <label class="form-check-label" htmlFor="isSpectator">
              Я только посмотреть
            </label>
          </div>
        </div>
        <div className="input-group mb-3">
          <button className="btn btn-primary" onClick={loginclick}>
            Войти
          </button>
        </div>
        <div className="mt-2">
          <p>{props.tgUser}</p>
        </div>
      </div>
    );

}