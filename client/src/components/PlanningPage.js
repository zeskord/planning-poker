import React, { Component, Fragment } from 'react'
import { Container, InputGroup, Form, Button, BDiv } from 'bootstrap-4-react'
import UserList from './UserList'
import NavigationBar from './NavigationBar'

export default class PlanningPage extends Component {

    constructor(props) {
        super(props)
        // Инициализируем клиентский стейт.
        this.state = {
            user: {}, // name, isSpectator
            users: [], // Пользователи со всеми данными.
            spectators: [], // Зрители со всеми данными.
            userIDs: [], // Просто массив идентификаторов пользователей
            spectatorIDs: [], // Просто массив идентификаторов зрителей
            marksVisible: false, // Оценки вскрыты?
            mark: undefined // Оценка в поле ввода
        }
        this.tick = this.tick.bind(this)
        this.markChange = this.markChange.bind(this)
        this.sendClick = this.sendClick.bind(this)
        this.openClick = this.openClick.bind(this)
        this.clearMarksClick = this.clearMarksClick.bind(this)
        this.markKeyUp = this.markKeyUp.bind(this)
    }

    async componentDidMount() {
        try {
            const url = '/getUserData'
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            const json = await response.json()
            const user = {
                name: json.user,
                isSpectator: json.isSpectator
            }
            this.setState({ user: user })
            await this.tick()
            this.intervalID = setInterval(this.tick, 2000);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    // Глобальный клиентский тик. 
    async tick() {
        try {
            const url = '/tick'
            const response = await fetch(url)
            const responseData = await response.json()
            this.setState(responseData)
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    markChange(event) {
        this.setState({ mark: event.target.value })
    }

    async sendClick(event) {
        try {
            const url = '/sendMark'
            const reqBody = {
                user: this.state.user.name,
                mark: this.state.mark
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(reqBody)
            })
            await response.text()
            this.tick()
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    async markKeyUp(event) {
        if (event.keyCode === 13) {
            this.sendClick(event)
        }
    }

    async openClick(event) {
        try {
            const url = '/showMarks'
            await fetch(url, { method: 'POST' })
            this.tick()
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    async clearMarksClick(event) {
        try {
            const url = '/clearMarks'
            await fetch(url, { method: 'POST' })
            this.tick()
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    render() {
        return (
            <Fragment>
                <BDiv bg="light">
                    <NavigationBar userName={this.state.user.name} setAuthState={this.props.setAuthState} />
                    <Container>
                        <InputGroup lg my="2">
                            <InputGroup.PrependText>Оценка</InputGroup.PrependText>
                            <Form.Input type="number" onChange={this.markChange} onKeyUp={this.markKeyUp} />
                        </InputGroup>
                        <Button primary lg my="2" onClick={this.sendClick}>Отправить</Button>
                        <UserList users={this.state.users} marksVisible={this.state.marksVisible} currentUserName={this.state.user.name} />
                        <BDiv my="2">
                            <Button success lg onClick={this.openClick}>Вскрываемся</Button>
                        </BDiv>
                        <BDiv my="2">
                            <Button warning lg my="2" onClick={this.clearMarksClick}>Очистить оценки</Button>
                        </BDiv>
                    </Container>
                </BDiv>
            </Fragment>
        )
    }
}