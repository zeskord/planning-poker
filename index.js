const express = require('express')
const bodyParser = require("body-parser")
var cookieParser = require('cookie-parser')
const model = require("./model")

const app = express()
app.use(cookieParser())
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set("view engine", "ejs")
app.use(express.static("public"))

// Начало.
app.get('/', function (req, res) {
    var cookies = req.cookies
    if (cookies.user === undefined) {
        res.render("login", {invalidlogin: false})
    } else {
        res.render("plan", cookies.user)
    }
})

// Залогиниться.
app.post('/', urlencodedParser, (req, res) => {
    var userData  = {
        name: req.body.userName,
        isSpectator: (req.body.isSpectator === "on")}
    // TODO: сделать нормальную валидацию, а не проверку на пустую строку.
    if (userData.name === "") {
        res.render("login", {invalidlogin: true})
    } else {
        res.cookie("user", userData)
        res.render("plan", userData)
    }
})

// Разлогиниться.
app.post('/exit', urlencodedParser, (req, res) => {
    res.clearCookie("user")
    res.render("login", {invalidlogin: false})
})

// Периодический запрос от клиента.
app.get('/tick', function (req, res) {
    var cookies = req.cookies
    model.tick(cookies.user)
    res.send({
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
    res.send(cookies.user)
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

app.listen(8080)

// Запускаем обработчик ожидания
model.startCheckingInactiveUsers()