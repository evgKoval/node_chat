$(document).ready(function() {
    $('.room-item').first().addClass('active');
    getMessages($('.room-item').first().data('id'));

    $('form').find('input[name="room"]').val($('.room-item').first().data('id'));

    $('.room-item').each(function() {
        var $this = $(this);

        $this.on("click", function () {
            $('.input-search').find('input[name="search"]').val('');
            $('input[name="message"]').removeClass('is-invalid');
            $('.room-item').removeClass('active');

            $this.addClass('active');
            $('form').find('input[name="room"]').val($(this).data('id'));

            getMessages($(this).data('id'));
        });
    });

    $('.btn-send').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);

        var message = $('input[name="message"]').val();

        if(message == '') {
            $('input[name="message"]').addClass('is-invalid')
            return;
        } else {
            $('input[name="message"]').removeClass('is-invalid')
        }

        $($this).attr('disabled','disabled');

        $.ajax({
            type: 'POST',
            url: '/api/chat/message',
            data: {
                'room': $('form').find('input[name="room"]').val(),
                'message': message
            },
            success: function(response) {
                var name = $('.user-email').html();
                
                // <span class="d-block">' + name + '</span>\

                $('.messages').append('\
                    <div class="media text-right mb-3">\
                        <div class="media-body">\
                            <strong class="message-text" data-id="' + response.message.insertId + '">' + message + '</strong>\
                            <small class="d-block">just now</small>\
                        </div>\
                    </div>\
                ');
                        
                // <div style="' + getUserAvatar(response.messages[i].avatar) + '" class="user-avatar ml-3"></div>\

                var d = $('.messages');
                d.scrollTop(d.prop("scrollHeight"));

                // <img src="/images/avatar.png" class="ml-3" width="48" height="48">\

                var newMessage = $('.messages .media:last').find('.message-text');
                console.log(newMessage);

                newMessage.on("dblclick", function () {                    
                    newMessage.hide();

                    newMessage.before('\
                        <div class="input-group input-group-sm mt-2 mb-2">\
                            <input type="text" value="' + newMessage.html() + '" class="form-control message-edit">\
                            <div class="input-group-append">\
                                <button class="btn btn-danger message-delete" type="button">Delete</button>\
                            </div>\
                        </div>\
                    ');

                    var media = newMessage.parent().parent();
                    media.addClass('w-100');

                    $('.message-edit').focus();

                    $('.message-delete').click(function() {
                        console.log(newMessage)
                        deleteMessage(newMessage.data('id'));

                        newMessage.parent().parent().remove();
                    })

                    $('.message-edit').focusout(function() {
                        window.setTimeout(() => {
                            if(newMessage.html() != $(this).val()) {
                                editMessage($this.data('id'), $(this).val());
    
                                newMessage.html($(this).val());
    
                                newMessage.append('<span class="badge badge-pill badge-light ml-1">edited</span>');
                            }
    
                            media.removeClass('w-100');
    
                            $(this).parent().remove();
                            
                            newMessage.show();
                        }, 100)
                    });
                });

                $('input[name="message"]').val('');
                $($this).removeAttr('disabled');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                $($this).removeAttr('disabled');
            }
        });
    })

    $('.btn-create').on('click', function(e) {
        e.preventDefault();

        var inputName = $('#modal-create').find('input[name="name"]');
        // var selectUsers = $('#modal-create').find('select[name="users"]');
        var checkedUsers =  $('input[name="users"]:checked');
        var roomName = inputName.val();
        
        if(roomName == '') {
            inputName.addClass('is-invalid')
            return;
        } else {
            inputName.removeClass('is-invalid')
        }

        var selectUsers = [];

        if(checkedUsers.length > 0) {
            for(var j = 0; j < checkedUsers.length; j++) {
                selectUsers.push($(checkedUsers[j]).val());
            }
        }

        $(this).attr('disabled', 'disabled');

        $.ajax({
            type: 'POST',
            url: 'api/chat',
            data: {
                'name': inputName.val(),
                // 'users': selectUsers.val()
                'users': selectUsers
            },
            success: function (response) {
                $('.list-rooms .list-group-item:last').after('\
                    <li data-id="' + response.room_id + '" class="list-group-item room-item own-room">\
                        <span>' + response.room_name + '</span>\
                        <i class="edit-room far fa-edit"></i>\
                    </li>\
                ');

                $('.room-item:last').on("click", function () {
                    $('input[name="message"]').removeClass('is-invalid');
                    $('.room-item').removeClass('active');
        
                    $(this).addClass('active');
                    $('form').find('input[name="room"]').val($(this).data('id'));
        
                    getMessages($(this).data('id'));
                });

                $('#modal-create').modal('hide');
                $('#modal-create').find('input[name="name"]').val('');
                // $('#modal-create').find('select[name="users"]')[0].selectedIndex = -1;
                $('#modal-create').find('input[name="users"]').prop('checked', false);

                $('.edit-room').on('click', function() {
                    var roomId = $(this).parent().data('id');
            
                    loadRoomById(roomId);
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });

    $('.main-bar .input-search input').on('focusout', function() {
        var search = $('.main-bar .input-search').find('input[name="search"]').val();

        var messages = $('.messages .media');

        for(var i = 0; i < messages.length; i++) {
            $(messages[i]).show();
        }

        var count = 0;

        for(var i = 0; i < messages.length; i++) {
            if(!$(messages[i]).find('strong').html().includes(search)) {
                $(messages[i]).hide();
                count++;
            }
        }

        if($('.messages .media').length == count && search != '') {
            $('.messages').append('<h6 class="text-center">There are no messages by this message</h6>');
        } else {
            $('.messages h6').hide();
        }
    });

    $('.edit-room').on('click', function() {
        var roomId = $(this).parent().data('id');

        loadRoomById(roomId);
    });

    $('#modal-edit').on('hidden.bs.modal', function(e) {
        $(this).find('input[name="users"]').prop('checked', false);
    });

    $('.btn-room-edit').on('click', function(e) {
        e.preventDefault();

        var inputName = $('#modal-edit').find('input[name="name"]');
        // var selectUsers = $('#modal-create').find('select[name="users"]');
        var checkedUsers =  $('#modal-edit input[name="users"]:checked');
        var roomName = inputName.val();
        
        if(roomName == '') {
            inputName.addClass('is-invalid')
            return;
        } else {
            inputName.removeClass('is-invalid')
        }

        var selectUsers = [];

        if(checkedUsers.length > 0) {
            for(var j = 0; j < checkedUsers.length; j++) {
                selectUsers.push($(checkedUsers[j]).val());
            }
        }

        $(this).attr('disabled', 'disabled');

        var roomId = $('.room-item.active').data('id');

        editRoomData(roomId, roomName, selectUsers) 
    });

    $('.left-bar .input-search input').on('focusout', function() {
        $('.left-bar h6').hide();

        var search = $('.left-bar .input-search').find('input[name="search"]').val();

        var rooms = $('.room-item');

        for(var i = 0; i < rooms.length; i++) {
            $(rooms[i]).show();
        }

        var count = 0;

        for(var i = 0; i < rooms.length; i++) {
            console.log($(rooms[i]).html());
            if(!$(rooms[i]).find('span').html().includes(search)) {
                $(rooms[i]).hide();
                count++;
            }
        }

        if($('.room-item').length == count && search != '') {
            $('.room-item-create').after('<h6 class="text-center mt-3">There are no rooms by this query</h6>');
        } else {
            $('.left-bar h6').hide();
        }
    });
});

function getMessages(roomId) {
    $.ajax({
        type: "GET",
        url: '/api/chat/' + roomId,
        success: function (response) {
            $('.messages').empty();

            if(response.messages == null) {
                $('.messages').append('<h6 class="text-center">\
                    You have no access to see messages\
                    <br>\
                    <a href="#" class="send-access">Request an access</a>\
                </h6>');

                $('.send-access').on('click', function(e) {
                    e.preventDefault();

                    var userName = $('.user-name').html();
                    var userEmail = $('.user-email').html();
                    var userId = $('.user-id').html();
                    var roomName = $('.room-item.active').find('span').html();

                    $.ajax({
                        type: "POST",
                        url: '/send-access',
                        data: {
                            'room_id': roomId,
                            'user_name': userName,
                            'user_email': userEmail,
                            'user_id': userId,
                            'room_name': roomName,
                        },
                        success: function (response) {
                            $('.messages').append('<h6 class="text-center">\
                                Message successfully received\
                            </h6>');
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(textStatus, errorThrown);
                        }
                    });
                })

                return;
            }

            // <span class="d-block">' + response.messages[i].name + '</span>\

            if(response.messages.length > 0) {
                for(var i = 0; i < response.messages.length; i++) {
                    if(response.messages[i].own == 'true') {
                        $('.messages').append('\
                            <div class="media text-right mb-3">\
                                <div class="media-body">\
                                    <strong class="message-text" data-id="' + response.messages[i].id + '">' + response.messages[i].message_text + '</strong>\
                                    ' + editedMessage(response.messages[i].edited) + '\
                                    <small class="d-block" title="' + formatDate(response.messages[i].created_at) + '">' + formatPrettyDate(response.messages[i].created_at) + '</small>\
                                </div>\
                            </div>\
                        ');

                        // <div style="' + getUserAvatar(response.messages[i].avatar) + '" class="user-avatar ml-3"></div>\

                    } else {

                        
                        $('.messages').append('\
                        <div class="media mb-3">\
                                <div style="' + getUserAvatar(response.messages[i].avatar) + '" class="user-avatar mr-3"></div>\
                                <div class="media-body">\
                                    <span class="d-block">' + response.messages[i].name + '</span>\
                                    <strong class="message-text" data-id="' + response.messages[i].id + '">' + response.messages[i].message_text + '</strong>\
                                    ' + editedMessage(response.messages[i].edited) + '\
                                    <small class="d-block" title="' + formatDate(response.messages[i].created_at) + '">' + formatPrettyDate(response.messages[i].created_at) + '</small>\
                                </div>\
                            </div>\
                        ');
                    }
                }

                $('.message-text').each(function() {
                    var $this = $(this);

                    $this.on("dblclick", function () {
                        if(!$this.parent().parent().hasClass('text-right')) {
                            return;
                        }

                        $this.hide();

                        $this.before('\
                            <div class="input-group input-group-sm mt-2 mb-2">\
                                <input type="text" value="' + $this.html() + '" class="form-control message-edit">\
                                <div class="input-group-append">\
                                    <button class="btn btn-danger message-delete" type="button">Delete</button>\
                                </div>\
                            </div>\
                        ');

                        var media = $this.parent().parent();
                        media.addClass('w-100');

                        $('.message-edit').focus();

                        $('.message-delete').click(function() {
                            deleteMessage($this.data('id'));

                            $this.parent().parent().remove();
                        })

                        $('.message-edit').focusout(function() {
                            window.setTimeout(() => {
                                if($(this).val() != $this.html()) {
                                    editMessage($this.data('id'), $(this).val());
    
                                    $this.html($(this).val());
    
                                    $this.append('<span class="badge badge-pill badge-light ml-1">edited</span>');
                                }
    
                                media.removeClass('w-100');
    
                                $(this).parent().remove();
    
                                $this.show();
                            }, 100);
                        });
                    });
                });
            } else {
                $('.messages').append('<h6 class="text-center">There are no messages in this chat</h6>');
            }
            
            var d = $('.messages');
            d.scrollTop(d.prop("scrollHeight"));
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function editMessage(messageId, messageText) {
    $.ajax({
        type: "PUT",
        url: '/api/chat/message',
        data: {
            'message_id': messageId,
            'message_text': messageText
        },
        success: function (response) {
            console.log(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function editedMessage(edited) {
    if(edited == 1) {
        return '<span class="badge badge-pill badge-light ml-1">edited</span>';
    } else {
        return '';
    }
}

function deleteMessage(messageId) {
    $.ajax({
        type: "DELETE",
        url: '/api/chat/message',
        data: {
            'message_id': messageId
        },
        success: function (response) {
            console.log(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function formatPrettyDate(date) {
    return $.format.prettyDate(date);
}

function formatDate(date) {
    return $.format.date(date, "At dd.MM.yyyy HH:mm");
}

function getUserAvatar(avatar) {
    return 'background-image: url(../images/' + avatar + ')';
}

function loadRoomById(roomId) {
    $.ajax({
        type: "GET",
        url: '/api/room/' + roomId,
        success: function(response) {
            $('#modal-edit input[name="name"]').val(response.room[0].name);
            var checkboxes = $('#modal-edit input[name="users"]');
            console.log(response.room);

            for(var k = 0; k < response.room.length; k++) {
                checkboxes.each(function() {
                    if($(this).val() == response.room[k].user_id) {
                        $(this).prop("checked", true);
                    }
                });
            }

            $('#modal-edit').modal('show');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function editRoomData(roomId, roomName, selectUsers) {
    $.ajax({
        type: "PUT",
        url: '/api/room',
        data: {
            'id': roomId,
            'name': roomName,
            'users': selectUsers
        },
        success: function (response) {
            console.log(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}