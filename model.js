const model = {}

model.options = {
    // Интервал проверки неактивных пользователей в миллисекундах
    ckeckInactiveUsersInterval: 30000,
    // Количество миллисекунд без запросов от пользователя, когда он считается неактивным
    inactiveUsersTimeout: 30000
}

model.userIdCounter = 0;

// Пользователь
// Ключ - строка - Имя
// id - строка - идентификатор для заполнения ID в списке
// mark - строка - Оценка
// lastRequestTime - дата - время последнего зарпоса
model.users = new Map()

model.spectators = new Map()

model.marksVisible = false

model.addUser = function (userName) {

    // Ищем пользователя с таким именем
    var user = this.users.get(userName)
    if (user === undefined) {
        // Добавляется новый пользователь
        model.userIdCounter = model.userIdCounter + 1
        var user = {
            name: userName,
            id: "user" + model.userIdCounter.toString(),
            lastRequestTime: new Date()
        }
        this.users.set(userName, user)
    }

}

model.addSpectator = function (spectatorName) {

    var spectator = this.spectators.get(spectatorName)
    if (spectator === undefined) {
        // Добавляется новый наблюдатель
        model.userIdCounter = model.userIdCounter + 1
        var spectator = {
            name: spectatorName,
            id: "spectator" + model.userIdCounter.toString(),
            lastRequestTime: new Date()
        }
        this.spectators.set(spectatorName, spectator)
    }
}

model.userExists = function (userName) {

    var user = this.users.get(userName)
    return (user !== undefined)

}

model.delUser = function (userName) {

    this.users.delete(userName)

}

model.clearMarks = function () {

    for (var [name, user] of this.users) {
        user.mark = undefined
    }
    this.hideMarks()

}

model.setMark = function (userCookie, mark) {

    if (userCookie.isSpectator !== true) {
        var user = this.users.get(userCookie.name)
        if (user !== undefined) {
            user.mark = mark
        }
    }

}

// user - данные cookie
model.tick = function (userCookie) {

    var userName = userCookie.name
    var isSpectator = userCookie.isSpectator

    if (isSpectator) {
        spectator = this.users.get(userName)
        if (spectator === undefined) {
            this.addSpectator(userName)
        } else {
            spectator.lastRequestTime = new Date()
        }
    } else {
        user = this.users.get(userName)
        if (user === undefined) {
            this.addUser(userName)
        } else {
            user.lastRequestTime = new Date()
        }
    }

}

model.serializeUsers = function () {

    sUsers = []
    for (var [name, user] of this.users) {
        user = {
            name: name,
            id: user.id,
            mark: user.mark
        }
        sUsers.push(user)
    }
    return sUsers
}

model.fullReset = function () {

    this.userIdCounter = 0
    this.users.clear()
    this.spectators.clear()

}

model.startCheckingInactiveUsers = function () {
    setInterval(this.deleteInactiveUsers, this.options.ckeckInactiveUsersInterval);
}

// проверяет, время последних запросов от пользователей и удаляет неактивных
model.deleteInactiveUsers = function () {

    var currentDate = new Date();

    for (var [name, user] of model.users) {
        if (user.lastRequestTime === undefined || currentDate - user.lastRequestTime > model.options.inactiveUsersTimeout) {
            model.users.delete(name)
            console.log("Пользователь " + name + " удален")
        }
    }

}

model.showMarks = function () {
    
    this.marksVisible = true

}

model.hideMarks = function () {
    
    this.marksVisible = false

}

module.exports = model