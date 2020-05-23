const model = {}

model.userIdCounter = 0;

// Пользователь
// Ключ - строка - Имя
// id - строка - идентификатор для заполнения ID в списке
// mark - строка - Оценка
// isOnline - булево - Пользователь онлайн
// lastRequestTime - дата - время последнего зарпоса
model.users = new Map()

model.spectators = new Map()

model.addUser = function (userName) {

    // Ищем пользователя с таким именем
    var user = this.users.get(userName)
    if (user === undefined) {
        // Добавляется новый пользователь
        model.userIdCounter = model.userIdCounter + 1
        var user = {
            name: userName,
            id: "user" + model.userIdCounter.toString()
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
            id: "spectator" + model.userIdCounter.toString()
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

model.setOnline = function (userName) {

}

model.setOffline = function (userName) {

}

model.clearMarks = function () {

    for (var [name, user] of this.users) {
        user.mark = undefined
    }

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

module.exports = model