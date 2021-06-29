// Класс содержит основную логику.
//

const Users = require("./Users")

module.exports = class Main {
    // Интервал проверки неактивных пользователей в миллисекундах
    ckeckInactiveUsersInterval = 300000
    // Количество миллисекунд без запросов от пользователя, когда он считается неактивным
    inactiveUsersTimeout = 300000
    users // Коллекция пользователей.
    spectators // Коллекция зрителей
    marksVisible // Состояние видимости оценок.

    constructor() {
        this.users = new Users()
        this.spectators = new Users(true)
    }

    startCheckingInactiveUsers() {
        setInterval(this.deleteInactiveUsers, this.ckeckInactiveUsersInterval, this)
    }

    deleteInactiveUsers(mainObject) {
        var currentDate = new Date()
        var collections = [mainObject.users, mainObject.spectators]
        for (var collection of collections) {
            for (var [name, user] of collection.getUsers()) {
                if (
                    user.lastRequestTime === undefined ||
                    currentDate - user.lastRequestTime > mainObject.inactiveUsersTimeout
                ) {
                    collection.delUser(name)
                }
            }
        }
    }

    tick(userData) {
        var userName = userData.name
        var collection = userData.isSpectator ? this.spectators : this.users
        var user = collection.getUsers().get(userName)
        if (user === undefined) {
            collection.addUser(userName)
        } else {
            user.lastRequestTime = new Date()
        }

        return {
            result: 1,
            users: this.users.serialize(),
            spectators: this.spectators.serialize(),
            marksVisible: this.marksVisible,
            userIDs: this.users.getIDs(),
            spectatorIDs: this.spectators.getIDs(),
        }
    }

    showMarks() {
        this.marksVisible = true
    }

    hideMarks() {
        this.marksVisible = false
    }

    setMark(userData, mark) {
        if (userData.isSpectator !== true) {
            var user = this.users.getUsers().get(userData.name)
            if (user !== undefined) {
                user.mark = mark
            }
        }
    }

    clearMarks() {
        for (var [name, user] of this.users.getUsers()) {
            user.mark = undefined
        }
        this.hideMarks()
    }

    fullReset() {
        this.users.idCounter = 0
        this.spectators.idCounter = 0
        this.users.clear()
        this.spectators.clear()
    }

    getUserID(userData) {
        var collection = userData.isSpectator ? this.spectators : this.users
        var user = collection.getUsers().get(userData.name)
        if (user === undefined) {
            return undefined
        } else {
            return user.id
        }
    }

    delUser(userData) {
        var collection = userData.isSpectator ? this.spectators : this.users
        collection.delUser(userData.name)
    }
}
