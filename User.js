// Класс содержит описание пользователя.
//

module.exports = class User {

    // Публичные поля.
    name // Имя пользователя.
    id // Идентификатор пользователя в списке на клиенте. key для списка в React JS.
    lastRequestTime // Время последнего запроса от клиента пользователя.
    mark = undefined // Текущая оценка пользователя.

    constructor(name, id) {
        this.name = name
        this.id = id
        this.lastRequestTime = new Date()
    }

}