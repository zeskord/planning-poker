import React, { Component } from 'react'
import Cookies from 'universal-cookie'
import { GlobalContext } from './context/GlobalContext'
import PlanningPage from './components/PlanningPage'
import LoginForm from './components/LoginForm'

export default class App extends Component {

    constructor(props) {
        super(props);

        const cookies = new Cookies();
        var user = cookies.get("user")
        const isAuthenticated = user !== undefined

        this.state = {
            isAuthenticated: isAuthenticated,
            isSpectator: user.isSpectator,
            userName: user.name
        }
        this.setAuthState = this.setAuthState.bind(this)
    }

    setAuthState(userData) {
        this.setState({
            userName: userData.name,
            isAuthenticated: true
        })
    }

    render() {
        return (
            <GlobalContext.Provider value={this.state}>
                {this.state.isAuthenticated ? (
                    <PlanningPage />
                )
                    :
                    (
                        <LoginForm setAuthState={this.setAuthState} />
                    )}
            </GlobalContext.Provider >
        )
    }
}