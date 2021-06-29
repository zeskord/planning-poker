// Класс содержит список пользователей.
//

const User = require("./User")

module.exports = class Users {
    idCounter // Счетчик пользователей для генерации строкового идентификатора на клиентах.
    #idPrefix // Префикс идентификатора для клиента.
    #users // Ассоциативный массив для поиска пользователей.
    #isSpectators = false // Это зрители?

    constructor(isSpectators) {
        this.users = new Map()
        this.idCounter = 0
        this.idPrefix = isSpectators ? "spectator" : "user"
        this.isSpectators = isSpectators
    }

    getUsers() {
        return this.users
    }

    // Добавление пользователя (регисрация)
    addUser(name) {
        // Ищем пользователя с таким именем
        var user = this.users.get(name)
        if (user === undefined) {
            this.idCounter++
            var id = this.idPrefix + this.idCounter.toString()
            var user = new User(name, id)
            this.users.set(name, user)
        }
        return this.idCounter
    }

    userExists(userName) {
        var user = this.users.users.get(userName)
        return user !== undefined
    }

    delUser(userName) {
        this.users.delete(userName)
        console.log(`Пользователь ${userName} удален`)
    }

    serialize() {
        var sUsers = []
        for (var [name, user] of this.users) {
            user = {
                name: name,
                id: user.id,
                mark: user.mark,
            }
            sUsers.push(user)
        }
        return sUsers
    }

    getIDs() {
        var UserIDs = []
        for (var [name, user] of this.users) {
            UserIDs.push(user.id)
        }
        return UserIDs
    }

    clear() {
        this.users.clear()
    }
}
