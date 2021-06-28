// Класс содержит основную логику.
//

const Users = require("./Users")
const User = require("./User")

module.exports = class Main {

    // Интервал проверки неактивных пользователей в миллисекундах
    ckeckInactiveUsersInterval = 300000
    // Количество миллисекунд без запросов от пользователя, когда он считается неактивным
    inactiveUsersTimeout = 300000
    #users

    constructor() {
        this.#users = new Users()
    }
    
    startCheckingInactiveUsers() {
        setInterval(this.deleteInactiveUsers, this.ckeckInactiveUsersInterval)
    }

    deleteInactiveUsers() {
        var currentDate = new Date()
        for (var [name, user] of users.users) {
            if (user.lastRequestTime === undefined || currentDate - user.lastRequestTime > this.options.inactiveUsersTimeout) {
                this.users.delUser(name)
            }
        }
    }

    tick(userData) {
        var userName = userData.name
        user = this.users.get(userName)
        if (user === undefined) {
            this.addUser(userName)
        } else {
            user.lastRequestTime = new Date()
        }
    }

    serializeUsers() {
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

}