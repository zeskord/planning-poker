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

    getUserData()
    sendGetQuery()

    function sendGetQuery() {
        $.get("/tick",
            {},
            function (serverData) {
                updateUsersList(serverData)
                setTimeout(sendGetQuery, 2000)
            })
    }

    function getUserData() {
        $.get("/getUserData",
            {},
            function (serverData) {
                $("body").data("user", { name: serverData.name, isSpectator: serverData.isSpectator })
            })
    }

})

function updateUsersList(serverData) {

    var users = serverData.users
    var marksVisible = serverData.marksVisible
    var usersList = $('#userList')
    var currentUserName = $("body").data("user").name

    for (let userData of users) {
        findedElement = usersList.find('#' + userData.id)
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
        if (findedElement.length === 0) {
            usersList.append(element)
        } else {
            findedElement.replaceWith(element)
        }

    }


}

function sendMark() {
    var mark = $('#markInput').val()
    $.post('/sendMark', { mark: mark }, () => {
    })
}