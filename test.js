const Main = require("./Main")

main = new Main()

testUser = {
    name: "Андрей",
    isSpectator: false
}
main.tick(testUser)
console.log(main.users.serialize())

main.deleteInactiveUsers()