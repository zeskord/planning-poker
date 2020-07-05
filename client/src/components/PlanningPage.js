import React, { Component, Fragment } from 'react'
import { Container, InputGroup, Form, Button, BDiv } from 'bootstrap-4-react'
import UserList from './/UserList'
import NavigationBar from './/NavigationBar'

export default class App extends Component {

    constructor(props) {
        super(props)
        // Инициализируем клиентский стейт.
        this.state = {
            users: [], // Пользователи со всеми данными.
            spectators: [], // Зрители со всеми данными.
            userIDs: [], // Просто массив идентификаторов пользователей
            spectatorIDs: [], // Просто массив идентификаторов зрителей
            marksVisible: false, // Оценки вскрыты?
            test: ""
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    async componentDidMount() {
        const url = '/test'
        const response = await fetch(url)
        const json = await response.json()
        this.setState({ users: json })
        this.intervalID = setInterval(this.tick, 4000);
    }


    // // Обработка результата глобального тика.
    // tickReady() {
    //     if (request.readyState == 4) {
    //         var status = request.status
    //         if (status == 200) {
    //             console.log(request.responseText)
    //         } else {
    //             console.log("Ответ сервера " + request.statusText)
    //         }
    //     }
    // }

    // Глобальный клиентский тик. 
    async tick() {
        const url = '/tick'
        const response = await fetch(url)
        const json = await response.json()
        this.setState(json, () => {console.log(this.state)})

    }

    render() {
        return (
            <Fragment>
                <BDiv bg="light">
                    <NavigationBar userName="Пользователь 1" />
                    <Container>
                        <InputGroup lg my="2">
                            <InputGroup.PrependText>Оценка</InputGroup.PrependText>
                            <Form.Input type="number" />
                        </InputGroup>
                        <Button primary lg my="2">Отправить</Button>
                        <UserList value="" />
                        <BDiv my="2">
                            <Button success lg >Вскрываемся</Button>
                        </BDiv>
                        <BDiv my="2">
                            <Button warning lg my="2">Очистить оценки</Button>
                        </BDiv>
                    </Container>
                </BDiv>
            </Fragment>
        )
    }
}