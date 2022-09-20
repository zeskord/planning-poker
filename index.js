const express = require('express')
const https = require('https');
const config = require('config')
const path = require('path')
const Main = require("./Main")
const fs = require("fs")

const cookieParser = require('cookie-parser')
const app = express()

// Читаем настройки SSL.
const sslOptions = {}
try {
    const sslOptions = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    }
} catch (err) {
    console.log(err)
}

app.use(cookieParser())
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
    res.cookie("user", userData, {
        expires: new Date(Date.now() + 315360000),
        maxAge: new Date(Date.now() + 315360000)
    })
    res.json(userData)
})

// Разлогиниться.
app.post('/api/logOut', (req, res) => {
    var cookies = req.cookies
    // Сначала удаляем пользователя из модели.
    main.delUser(cookies.user)
    // Затем очищаем Cookie у пользователя на клиенте.
    res.clearCookie("user")
    res.status(200).send("OK")
})

// Периодический запрос от клиента.
app.get('/api/tick', function (req, res) {
    var cookies = req.cookies
    var data = main.tick(cookies.user)
    res.json(data)
})

// Просто вернуть данные пользователя с сервера на клиент.
app.get('/api/getUserData', function (req, res) {
    var cookies = req.cookies
    var user = {
        user: cookies.user.name,
        isSpectator: cookies.user.isSpectator,
        id: main.getUserID(cookies.user)
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
    var cookies = req.cookies
    main.setMark(cookies.user, req.body.mark)
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

const PORT = config.get('port') || 80

if (PORT === 80) {
    app.listen(PORT)
} else {
    https.createServer(sslOptions, app).listen(PORT)
}

// Запускаем обработчик ожидания
main.startCheckingInactiveUsers()