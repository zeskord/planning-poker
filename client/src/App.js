import React, { useState } from 'react'
import { PlanningPage } from './components/PlanningPage'
import { LoginForm } from './components/LoginForm'
import 'bootstrap/dist/css/bootstrap.min.css'
import socket from './socket'

export const App = (props) => {

    const style = {
        minWidth: '100vw',
        minHeight: '100vh'
    }

    var user = {
        userName: localStorage.getItem("userName"),
        isSpectator: (localStorage.getItem("isSpectator") === "true") ? true : false
    }
    const isAuthenticated = (user.userName !== null)

    const [AuthState, setAuthState] = useState({
        isAuthenticated: isAuthenticated,
        isSpectator: isAuthenticated ? user.isSpectator : false,
        userName: isAuthenticated ? user.userName : undefined
    })

    console.log("user " , user)
    socket.emit('login', user, (response) => {
        console.log("login status " , response.status)
    })

    return (
        <div className="bg-light" style={style}>
            {AuthState.isAuthenticated ? (
                <PlanningPage setAuthState={setAuthState} />
            )
                :
                (
                    <LoginForm setAuthState={setAuthState} />
                )}
        </div>
    )
}