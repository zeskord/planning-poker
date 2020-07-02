import React, { Component, Fragment } from 'react'
import { Container, InputGroup, Form, Button, BDiv } from 'bootstrap-4-react'
import UserList from './components/UserList'
import NavigationBar from './components/NavigationBar'

async function getData(url = '') {

    try {
        // // Default options are marked with *
        // const response = await fetch(url, {
        //     method: 'GET', // *GET, POST, PUT, DELETE, etc.
        //     mode: 'no-cors', // no-cors, *cors, same-origin
        //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //     credentials: 'same-origin', // include, *same-origin, omit
        //     headers: {
        //         'Content-Type': 'application/json'
        //         // 'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     // redirect: 'follow', // manual, *follow, error
        //     // referrerPolicy: 'no-referrer'
        // })

        return await fetch(url, {
            mode: 'no-cors',
            credentials: 'omit'
        })
        .then(response => response.json())
        //return await response.json()
        // console.log(data)
        // return data

    } catch (error) {
        console.error('Ошибка:', error)
    }
}



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

    async componentDidMount() {

        const url = '/api/test'
        const response = await fetch(url)
        const json = await response.json()
        this.setState({users: json})
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

    // // Глобальный клиентский тик. 
    // tick() {
    //     var request = new XMLHttpRequest()
    //     request.open("GET", "/tick")
    //     request.onload = tickReady
    //     request.responseType = "json"
    //     request.send()
    // }

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