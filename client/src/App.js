import React, { Component, Fragment } from 'react'
import Cookies from 'universal-cookie'

import PlanningPage from './components/PlanningPage'
import LoginForm from './components/LoginForm'

export default class App extends Component {

    constructor(props) {
        super(props);

        const cookies = new Cookies();
        var user = cookies.get("user")
        const isAuthenticated = (user !== undefined)

        this.state = {
            isAuthenticated: isAuthenticated,
            isSpectator: isAuthenticated ? user.isSpectator : undefined,
            userName: isAuthenticated ? user.name : undefined
        }
        this.setAuthState = this.setAuthState.bind(this)
    }

    setAuthState(userData, isAuthenticated) {
        this.setState({
            userName: userData.name,
            isAuthenticated: isAuthenticated
        })
    }

    render() {
        return (
            <Fragment>
                {this.state.isAuthenticated ? (
                    <PlanningPage setAuthState={this.setAuthState}/>
                )
                    :
                    (
                        <LoginForm setAuthState={this.setAuthState} />
                    )}
            </Fragment>
        )
    }
}