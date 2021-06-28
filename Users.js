// Класс содержит список пользователей.
//

const User = require("./User")

module.exports = class Users {

    idCounter // Счетчик пользователей для генерации строкового идентификатора на клиентах.
    #idPrefix // Префикс идентификатора для клиента.
    #users // Ассоциативный массив для поиска пользователей.
    #isSpectators = false // Это зрители?


    constructor() {
        this.users = new Map()
        // this.registered = new Map()
    }

    // Добавление пользователя (регисрация)
    addUser(name) {
        // Ищем пользователя с таким именем
        var user = this.users.get(name)
        if (user === undefined) {
            id = this.idPrefix + this.idCounter.toString()
            var user = new User(name, id)
            this.users.set(name, user)
        }
        return idCounter
    }

    userExists(userName) {
        var user = this.users.get(userName)
        return (user !== undefined)
    }

    delUser(userName) {
        this.users.delete(userName)
        console.log(`Пользователь ${userName} удален`)
    }

    clearMarks() {
        for (var [name, user] of this.users) {
            user.mark = undefined
        }
        this.hideMarks()
    }

    setMark(userName, mark) {
        if (isSpectators !== true) {
            var user = this.users.get(userName)
            if (user !== undefined) {
                user.mark = mark
            }
        }
    }

}