const express = require('express')
const config = require('config')
const path = require('path')
const bodyParser = require("body-parser")
const model = require("./model")

var cookieParser = require('cookie-parser')
const app = express()

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 8080




app.use(cookieParser())
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//var JSONParser = bodyParser.json()
app.set('json spaces', 2)
app.use(bodyParser.json())
app.set("view engine", "ejs")
app.use(express.static("public"))

// Начало.
app.get('/', function (req, res) {
    var cookies = req.cookies
    if (cookies.user === undefined) {
        res.render("login", { invalidlogin: false })
    } else {
        res.render("plan", cookies.user)
    }
})

// Залогиниться.
app.post('/', urlencodedParser, (req, res) => {
    var userData = {
        name: req.body.userName,
        isSpectator: (req.body.isSpectator === "on")
    }
    // TODO: сделать нормальную валидацию, а не проверку на пустую строку.
    if (userData.name === "") {
        res.render("login", { invalidlogin: true })
    } else {
        res.cookie("user", userData)
        res.render("plan", userData)
    }
})

// Разлогиниться.
app.post('/exit', urlencodedParser, (req, res) => {
    res.clearCookie("user")
    res.render("login", { invalidlogin: false })
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
    res.send(user)
})

// Очищает оценки.
app.post('/clearMarks', urlencodedParser, (req, res) => {
    model.clearMarks()
    res.send("OK")
})

// Регистрирует оценку от клиента.
app.post('/sendMark', urlencodedParser, (req, res) => {
    var cookies = req.cookies
    model.setMark(cookies.user, req.body.mark)
    res.send("OK")
})

// Показать оценки.
app.post('/showMarks', urlencodedParser, (req, res) => {
    model.showMarks()
    res.send("OK")
})

// Полный сброс модели.
app.post('/fullReset', urlencodedParser, (req, res) => {
    model.fullReset()
    res.redirect("/")
})

app.get('/test', (req, res) => {
    var json = [{test: 'OK'}]
    res.json(json)
})

app.listen(PORT)

// Запускаем обработчик ожидания
model.startCheckingInactiveUsers()