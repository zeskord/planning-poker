const express = require('express')
const config = require('config')
const path = require('path')
const Main = require("./Main")
var cors = require('cors')
const fs = require('fs')
const http = require('http')
// const https = require('https')

const app = express()

app.use(cors())

app.set('json spaces', 2)
app.use(express.json())
app.use(express.static("public"))

// создаем объект приложения, содержащий логику.
main = new Main()

// Залогиниться.
app.post('/api/login', (req, res) => {
    var userData = {
        name: req.body.userName,
        isSpectator: (req.body.isSpectator)
    }
    res.json(userData)
})

// Разлогиниться.
app.post('/api/logOut', (req, res) => {
    var userData = JSON.parse(req.get('user-data'));
    // Сначала удаляем пользователя из модели.
    main.delUser(userData)
    res.status(200).send("OK")
})

// Периодический запрос от клиента.
app.get('/api/tick', function (req, res) {
    var userData = JSON.parse(req.get('user-data'));
    var data = main.tick(userData)
    res.json(data)
})

// Просто вернуть данные пользователя с сервера на клиент.
app.get('/api/getUserData', function (req, res) {
    var userData = JSON.parse(req.get('user-data'));
    var user = {
        user: userData.name,
        isSpectator: userData.isSpectator,
        id: main.getUserID(userData)
    }
    res.json(user)
})

// Очищает оценки.
app.post('/api/clearMarks', (req, res) => {
    main.clearMarks()
    res.status(200).send("OK")
})

// Регистрирует оценку от клиента.
app.post('/api/sendMark', (req, res) => {
    var userData = JSON.parse(req.get('user-data'));
    main.setMark(userData, req.body.mark)
    res.status(200).send("OK")
})

// Показать оценки.
app.post('/api/showMarks', (req, res) => {
    main.showMarks()
    res.status(200).send("OK")
})

// Полный сброс модели.
app.post('/api/fullReset', (req, res) => {
    main.fullReset()
    res.status(200).send("OK")
})

app.get('/test', (req, res) => {
    var json = [{ test: 'OK' }]
    res.json(json)
})

// Исключительно для отладки.
app.get('/deleteInactiveUsers', (req, res) => {
    main.deleteInactiveUsers()
    res.status(200).send("OK")
})

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 443

// Если не используется SSL, закомментировать строки ниже.
const options = {}
// app.listen(PORT)
http.createServer(options, app).listen(PORT);

// Запускаем обработчик ожидания
main.startCheckingInactiveUsers()