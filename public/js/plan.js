$('#exitlink').click(function () {

    $.post('/exit', {}, () => {
        $(location).attr('href', "/");
    })
})

$('#clearMarks').click(function () {

    $.post('/clearMarks', {}, () => {
    })
})

$('#sendMark').click(function () {

    sendMark()

})

$('#fullReset').click(function () {

    $.post('/fullReset', {}, () => {
    })
})

$('#showMarks').click(function () {

    $.post('/showMarks', {}, () => {
    })
})

$("#markInput").keydown(function (event) {
    if (event.originalEvent.key === "Enter") {
        sendMark()
    }
})

$(function () {

    // Инициализируем массив имен пользователей в данных формы, чтобы потом можно было их выпиливать.
    $("body").data("userIDs", [])
    $("body").data("spectatorIDs", [])
    getUserData()
    sendGetQuery()

    // Получаем данные о себе с сервера, на основании печенья, которое ему отправляем.
    function getUserData() {
        try {
            $.get("/getUserData",
                {},
                function (serverData) {
                    $("body").data("user", {
                        name: serverData.user,
                        isSpectator: serverData.isSpectator
                    })
                })
        } catch (err) {

            console.log(err)

        }
    }

    // Тикающий запрос.
    function sendGetQuery() {
        try {
            $.get("/tick",
                {},
                function (serverData) {
                    updateUsersList(serverData)
                    setTimeout(sendGetQuery, 2000)
                })

        } catch (err) {

            setTimeout(sendGetQuery, 2000)
            console.log(err)

        }

    }

})

function updateUsersList(serverData) {

    var usersList = $('#userList')

    // Получаем массив идентификаторов пользователей в списке.
    var currentUserIDs = $("body").data("userIDs")
    // Массив идентификаторов пользователей, который вернула модель.
    var userIDs = serverData.userIDs
    // Ищем элемент удаленного пользователя и выпиливаем его из Листгруппы.
    var IDsToRemove = []
    for (let currentUserID of currentUserIDs) {
        if (userIDs.includes(currentUserID, 0) === false) {
            usersList.find(`#${currentUserID}`).remove()
            IDsToRemove.push(currentUserID)
        }
    }
    if (IDsToRemove.length !== 0) {
        for (let id of IDsToRemove) {
            var index = IDsToRemove.indexOf(id)
            currentUserIDs.splice(index + 1, 1)
        }
    }

    var users = serverData.users
    var marksVisible = serverData.marksVisible
    var currentUserName = $("body").data("user").name

    for (let userData of users) {

        foundElement = usersList.find(`#${userData.id}`)
        var bgcolor = ""
        var badge = ""
        var badgeStyle = "primary" // цвет бейджа по умолчанию.
        // Текущий пользователь, если ответил, но еще не вскрылись, выводится серым бейджиком.
        if (userData.mark !== undefined && !marksVisible && userData.name === currentUserName) {
            badgeStyle = "secondary"
            badge = `<span class="badge badge-${badgeStyle} badge-pill">${userData.mark}</span>`
        }
        if (userData.mark !== undefined && marksVisible) {
            badge = `<span class="badge badge-${badgeStyle} badge-pill">${userData.mark}</span>`
        }
        if (userData.mark !== undefined) {
            bgcolor = "list-group-item-success"
        }
        var element =
            `<li class="list-group-item ${bgcolor} d-flex justify-content-between align-items-center" id="${userData.id}">${userData.name}${badge}</li>`
        if (foundElement.length === 0) {
            usersList.append(element)
            currentUserIDs.push(userData.id)
        } else {
            foundElement.replaceWith(element)
        }

    }
    $("body").data("userIDs", currentUserIDs)

    ////////////////////////////////////////////////////////////////////////////////////
    // Наблюдатели

    var spectatorsList = $('#spectatorList')
    var currentSpectatorIDs = $("body").data("spectatorIDs")
    var spectatorIDs = serverData.spectatorIDs
    // Ищем элемент удаленного пользователя и выпиливаем его из Листгруппы.
    var IDsToRemove = []
    for (let currentSpectatorID of currentSpectatorIDs) {
        if (spectatorIDs.includes(currentSpectatorID, 0) === false) {
            spectatorsList.find(`#${currentSpectatorID}`).remove()
            IDsToRemove.push(currentSpectatorID)
        }
    }
    if (IDsToRemove.length !== 0) {
        for (let id of IDsToRemove) {
            var index = IDsToRemove.indexOf(id)
            currentSpectatorIDs.splice(index + 1, 1)
        }
    }
    var spectators = serverData.spectators
    // Если количество зрителей ноль, то всю карту не выводим.
    var spectatorsCard = $("#spectatorsCard:visible")
    if (spectatorsCard.length === 1 && spectators.length === 0) {
        spectatorsCard.hide()
    }
    var spectatorsCard = $("#spectatorsCard:hidden")
    if (spectators.length === 1 && spectators.length !== 0) {
        spectatorsCard.show()
    }

    for (let userData of spectators) {

        foundElement = spectatorsList.find(`#${userData.id}`)
        var element =
            `<li class="list-group-item d-flex justify-content-between align-items-center" id="${userData.id}">${userData.name}</li>`
        if (foundElement.length === 0) {
            spectatorsList.append(element)
            currentSpectatorIDs.push(userData.id)
        } else {
            foundElement.replaceWith(element)
        }

    }
    $("body").data("spectatorIDs", currentSpectatorIDs)

}

function sendMark() {
    var mark = $('#markInput').val()
    $.post('/sendMark',
        // Это отправляем на сервер.
        {
            mark: mark
        },
        // А это используем для мгновенного обновления интерфейса на клиенте.
        (mark) => {
            // После отправки оценки на сервер, находим элемент и обновляем его.
            // Но это не критично, можно сделать потом.


        })
}