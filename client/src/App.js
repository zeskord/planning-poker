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
        name: localStorage.getItem("name"),
        isSpectator: localStorage.getItem("isSpectator")
    }
    const isAuthenticated = (user.name !== null)

    const [AuthState, setAuthState] = useState({
        isAuthenticated: isAuthenticated,
        isSpectator: isAuthenticated ? user.isSpectator : undefined,
        userName: isAuthenticated ? user.name : undefined
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