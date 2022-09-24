import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import { PlanningPage } from './components/PlanningPage'
import { LoginForm } from './components/LoginForm'
import 'bootstrap/dist/css/bootstrap.min.css'

const tg = window.Telegram.WebApp
// import './darktheme.css';

export const App = (props) => {

    const style = {
        minWidth: '100vw',
        minHeight: '100vh'
    }

    
    if ("user" in tg.initDataUnsafe) {
        var tgUser = tg.initDataUnsafe.user
    } else {
        var tgUser = undefined
    }
    console.log(tg)

    const cookies = new Cookies()
    var user = cookies.get("user")
    const isAuthenticated = (user !== undefined)

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
                    <LoginForm setAuthState={setAuthState}/>
                )}
            <div className="mt-2">
                <p>{JSON.stringify(tgUser)}</p>
            </div>
        </div>
    )
}