const model = {}

model.options = {
    // Интервал проверки неактивных пользователей в миллисекундах
    ckeckInactiveUsersInterval: 300000,
    // Количество миллисекунд без запросов от пользователя, когда он считается неактивным
    inactiveUsersTimeout: 300000
}

// Поиск по имени пользователя имени его идентификатора и других реквизитов.
// Не очищается при выходе пользователя, живет до конца.
//
// Пользователь
// Ключ - строка - Имя
// id - строка - идентификатор для заполнения ID в списке
// mark - строка - Оценка
model.registeredUsers = new Map()
model.registeredSpectators = new Map()

// Счетчики пользователей и зрителей. Живут до конца.
model.userIdCounter = 0
model.spectatorIdCounter = 0

// В отличие от registeredUsers, registeredSpectators, выкидывают пользователя, елси от него нет запросов в течение
// некоторого времени.
//
// Пользователь
// Ключ - строка - Имя
// id - строка - идентификатор для заполнения ID в списке
// mark - строка - Оценка
// lastRequestTime - дата - время последнего зарпоса
model.users = new Map()
model.spectators = new Map()

model.marksVisible = false

model.addUser = function (userName) {

    var newCounter = addUser(userName, this.registeredUsers, this.users, this.userIdCounter, "user")
    if (newCounter !== undefined) {
        this.userIdCounter = newCounter
    }

}

model.addSpectator = function (spectatorName) {

    var newCounter = addUser(spectatorName, this.registeredSpectators, this.spectators, this.spectatorIdCounter, "spectator")
    if (newCounter !== undefined) {
        this.spectatorIdCounter = newCounter
    }

}

function addUser(name, registeredCollection, collection, idCounter, idPrefix) {

    // Ищем пользователя с таким именем
    var user = collection.get(name)
    if (user === undefined) {

        // Если пользователя не нашли, то ищем среди "Спящих" пользователей
        var registeredUser = registeredCollection.get(name)
        if (registeredUser === undefined) {
            // Раньше не было такого имени. Регистрируем пользователя в "вечной" коллекции.
            idCounter = idCounter + 1
            registeredUser = {
                id: idPrefix + idCounter.toString()
            }
            registeredCollection.set(name, registeredUser)
        }
        // Добавляется новый пользователь в коллекцию отображаемых на клиентах.
        var user = {
            name: name,
            id: registeredUser.id,
            lastRequestTime: new Date()
        }
        collection.set(name, user)

    }

    return idCounter

}

model.userExists = function (userName) {

    var user = this.users.get(userName)
    return (user !== undefined)

}

model.delUser = function (userName) {

    this.users.delete(userName)

}

model.delSpectator = function (userName) {

    this.spectators.delete(userName)

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
        spectator = this.spectators.get(userName)
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

model.serializeSpectators = function () {

    sUsers = []
    for (var [name, user] of this.spectators) {
        user = {
            name: name,
            id: user.id
        }
        sUsers.push(user)
    }
    return sUsers
}

model.fullReset = function () {

    this.userIdCounter = 0
    this.spectatorIdCounter = 0
    this.users.clear()
    this.spectators.clear()
    this.registeredUsers.clear()
    this.registeredSpectators.clear()

}

model.startCheckingInactiveUsers = function () {
    setInterval(this.deleteInactiveUsers, this.options.ckeckInactiveUsersInterval)
}

// проверяет, время последних запросов от пользователей и удаляет неактивных
model.deleteInactiveUsers = function () {

    var currentDate = new Date()

    for (var [name, user] of model.users) {
        if (user.lastRequestTime === undefined || currentDate - user.lastRequestTime > model.options.inactiveUsersTimeout) {
            // Перед удалением сохраняем оценку.
            var registeredUser = {
                id: user.id,
                mark: user.mark
            }
            model.registeredUsers.set(name, registeredUser)
            model.users.delete(name)
            console.log("Пользователь " + name + " удален")
        }
    }

    for (var [name, user] of model.spectators) {
        if (user.lastRequestTime === undefined || currentDate - user.lastRequestTime > model.options.inactiveUsersTimeout) {
            var registeredSpectator = {
                id: user.id
            }
            model.registeredSpectators.set(name, registeredSpectator)
            model.spectators.delete(name)
            console.log("Наблюдатель " + name + " удален")
        }
    }

}

model.showMarks = function () {

    this.marksVisible = true

}

model.hideMarks = function () {

    this.marksVisible = false

}

model.getUserID = function (userData) {
    if (userData.isSpectator === false) {
        var collection = this.registeredUsers

    } else {
        var collection = this.registeredSpectators
    }
    var user = collection.get(userData.name)
    if (user === undefined) {
        return undefined
    } else {
        return user.id
    }
}

model.getUserIDs = function () {
    var UserIDs = []
    for (var [name, user] of this.users) {
        UserIDs.push(user.id)
    }
    return UserIDs
}

model.getSpectatorIDs = function () {
    var UserIDs = []
    for (var [name, user] of this.spectators) {
        UserIDs.push(user.id)
    }
    return UserIDs
}

module.exports = model