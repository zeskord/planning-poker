$('#exitlink').click(function () {
    
    $.post('/exit',{}, () => {
        $(location).attr('href', "/");
    })
})

$('#clearMarks').click(function () {
    
    $.post('/clearMarks',{}, () => {
    })
})

$('#sendMark').click(function () {
    
    var mark = $('#markInput')[0].value;
    $.post('/sendMark', {mark: mark}, () => {
    })
})

$('#fullReset').click(function () {
    
    $.post('/fullReset', {}, () => {
    })
})

$('#showMarks').click(function () {
    
    $.post('/showMarks', {}, () => {
    })
})

$(function () {

    var url = "/tick",
        data = {}
    sendGetQuery()

    function sendGetQuery() {
        $.get(url,
            data,
            function (serverData) {
                updateUsersList(serverData)
                setTimeout(sendGetQuery, 2000)
            })
    }

})

function updateUsersList(serverData) {
    users = serverData.users
    marksVisible = serverData.marksVisible
    usersList = $('#userList')
    
    for(let userData of users) {
        findedElement = usersList.find('#' + userData.id)
        var badge = ""
        var success = ""
        if (userData.mark !== undefined && marksVisible) {
            badge = '<span class="badge badge-primary badge-pill">' + userData.mark + '</span>';
        }
        if (userData.mark !== undefined) {
            success = "list-group-item-success " 
        }
        var element =
            '<li class="list-group-item ' + success + 'd-flex justify-content-between align-items-center" id="' +
            userData.id +
            '">' + userData.name + badge + '</li>'
        if (findedElement.length === 0) {
            usersList.append(element)
        } else {
            findedElement.replaceWith(element) 
        }
        
    }
    
     
}