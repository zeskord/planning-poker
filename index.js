const express = require('express')
const config = require('config')
const path = require('path')
const bodyParser = require("body-parser")
const model = require("./model")

var cookieParser = require('cookie-parser')
const app = express()

app.use(cookieParser())
app.set('json spaces', 2)
app.use(bodyParser.json())
app.use(express.static("public"))

// Залогиниться.
app.post('/', (req, res) => {
    var userData = {
        name: req.body.userName,
        isSpectator: (req.body.isSpectator)
    }
    res.cookie("user", userData, { expires: new Date(Date.now() + 60*60*24*365*10)})
    res.json(userData)
})

// Разлогиниться.
app.post('/logOut', (req, res) => {
    var cookies = req.cookies
    // Сначала удаляем пользователя из модели.
    model.delUser(cookies.user.name)
    // Затем очищаем Cookie у пользователя на клиенте.
    res.clearCookie("user")
    res.status(200).send("OK")
})

// Периодический запрос от клиента.
app.get('/tick', function (req, res) {
    var cookies = req.cookies
    model.tick(cookies.user)
    res.json({
        result: 1,
        users: model.serializeUsers(),
        spectators: model.serializeSpectators(),
        marksVisible: model.marksVisible,
        userIDs: model.getUserIDs(),
        spectatorIDs: model.getSpectatorIDs()
    })
})

// Просто вернуть данные пользователя с сервера на клиент.
app.get('/getUserData', function (req, res) {
    var cookies = req.cookies
    var user = {
        user: cookies.user.name,
        isSpectator: cookies.user.isSpectator,
        id: model.getUserID(cookies.user)
    }
    res.json(user)
})

// Очищает оценки.
app.post('/clearMarks', (req, res) => {
    model.clearMarks()
    res.status(200).send("OK")
})

// Регистрирует оценку от клиента.
app.post('/sendMark', (req, res) => {
    var cookies = req.cookies
    model.setMark(cookies.user, req.body.mark)
    res.status(200).send("OK")
})

// Показать оценки.
app.post('/showMarks', (req, res) => {
    model.showMarks()
    res.status(200).send("OK")
})

// Полный сброс модели.
app.post('/fullReset', (req, res) => {
    model.fullReset()
    res.status(200).send("OK")
})

app.get('/test', (req, res) => {
    var json = [{test: 'OK'}]
    res.json(json)
})

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 8081

app.listen(PORT)

// Запускаем обработчик ожидания
model.startCheckingInactiveUsers()