import React, { Component, Fragment } from 'react'
import { GlobalContext } from './context/GlobalContext'
import PlanningPage from './components/PlanningPage'
import LoginForm from './components/LoginForm'

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            isSpectator: false,
            userName: undefined
        }
    }

    render() {
        const isAuthenticated = true
        return (
            <GlobalContext.Provider value={this.state}>
                {this.state.isAuthenticated ? (
                    <PlanningPage />
                ) :
                    (
                        <LoginForm />
                    )}
            </GlobalContext.Provider >
        )
    }
}