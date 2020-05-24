const express = require('express')
const bodyParser = require("body-parser")
var cookieParser = require('cookie-parser')
const model = require("./model")

const app = express()
app.use(cookieParser())
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set("view engine", "ejs")
app.use(express.static("public"))

app.get('/', function (req, res) {
    var cookies = req.cookies
    if (cookies.user === undefined) {
        res.render("login", cookies.user)
    } else {
        res.render("plan", cookies.user)
    }
})

app.get('/plan', function (req, res) {

    res.render("plan", {
        title: "Планирование"
    })
})

app.post('/', urlencodedParser, (req, res) => {
    var userData  = {
        name: req.body.userName,
        isSpectator: (req.body.isSpectator === "on")}
    res.cookie("user", userData)
    res.render("plan", userData)
})

app.post('/exit', urlencodedParser, (req, res) => {
    var userData  = {
        name: req.body.userName,
        isSpectator: (req.body.isSpectator === "on")}
    res.clearCookie("user")
    res.render("login")
})

app.get('/tick', function (req, res) {
    var cookies = req.cookies
    model.tick(cookies.user)
    res.send({
        result: 1,
        users: model.serializeUsers(),
        marksVisible: model.marksVisible
    })
})

app.post('/clearMarks', urlencodedParser, (req, res) => {
    model.clearMarks()
    res.send("OK")
})

app.post('/sendMark', urlencodedParser, (req, res) => {
    var cookies = req.cookies
    model.setMark(cookies.user, req.body.mark)
    res.send("OK")
})

app.post('/showMarks', urlencodedParser, (req, res) => {
    model.showMarks()
    res.send("OK")
})

app.post('/fullReset', urlencodedParser, (req, res) => {
    model.fullReset()
    res.redirect("/")
})

app.listen(8080)

// Запускаем обработчик ожидания
model.startCheckingInactiveUsers()