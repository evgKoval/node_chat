$(document).ready(function() {
    $('.room-item').first().addClass('active');
    getMessages($('.room-item').first().data('id'))

    $('form').find('input[name="room"]').val($('.room-item').first().data('id'));

    $('.room-item').each(function() {
        var $this = $(this);

        $this.on("click", function () {
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
                var email = $('.user-email').html();

                $('.messages').append('\
                    <div class="media text-right mb-3">\
                        <div class="media-body">\
                            <span class="d-block">' + email + '</span>\
                            <strong class="message-text">' + message + '</strong>\
                            <small class="d-block">recently</small>\
                        </div>\
                        <img src="/images/avatar.png" class="ml-3" width="48" height="48">\
                    </div>\
                ');

                var newMessage = $('.messages .media:last').find('.message-text');
                console.log(newMessage);

                newMessage.on("dblclick", function () {
                    newMessage.hide();

                    newMessage.before('\
                        <div class="input-group input-group-sm mt-2 mb-2">\
                            <input type="text" value="' + newMessage.html() + '" class="form-control message-edit">\
                        </div>\
                    ');

                    $('.message-edit').focus();

                    $('.message-edit').focusout(function() {
                        if(newMessage.html() != $(this).val()) {
                            editMessage($this.data('id'), $(this).val());

                            newMessage.html($(this).val());

                            newMessage.append('<span class="badge badge-pill badge-light ml-1">edited</span>');
                        }

                        $(this).parent().remove();
                        
                        newMessage.show();
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
        var selectUsers = $('#modal-create').find('select[name="users"]');
        var roomName = inputName.val();
        
        if(roomName == '') {
            inputName.addClass('is-invalid')
            return;
        } else {
            inputName.removeClass('is-invalid')
        }

        $(this).attr('disabled','disabled');

        $.ajax({
            type: 'POST',
            url: 'api/chat',
            data: {
                'name': inputName.val(),
                'users': selectUsers.val()
            },
            success: function (response) {
                $('.list-group-item:last').before('\
                    <li data-id="' + response.room_id + '" class="list-group-item room-item">\
                        ' + response.room_name + '\
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
                $('#modal-create').find('select[name="users"]')[0].selectedIndex = -1;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
});

function getMessages(roomId) {
    $.ajax({
        type: "GET",
        url: '/api/chat/' + roomId,
        success: function (response) {
            $('.messages').empty();

            if(response.messages.length > 0) {
                for(var i = 0; i < response.messages.length; i++) {
                    if(response.messages[i].own == 'true') {
                        $('.messages').append('\
                            <div class="media text-right mb-3">\
                                <div class="media-body">\
                                    <span class="d-block">' + response.messages[i].email + '</span>\
                                    <strong class="message-text" data-id="' + response.messages[i].id + '">' + response.messages[i].message_text + '</strong>\
                                    ' + editedMessage(response.messages[i].edited) + '\
                                    <small class="d-block">' + response.messages[i].created_at + '</small>\
                                </div>\
                                <img src="/images/avatar.png" class="ml-3" width="48" height="48">\
                            </div>\
                        ');
                    } else {
                        $('.messages').append('\
                            <div class="media mb-3">\
                                <img src="/images/avatar.png" class="mr-3" width="48" height="48">\
                                <div class="media-body">\
                                    <span class="d-block">' + response.messages[i].email + '</span>\
                                    <strong class="message-text" data-id="' + response.messages[i].id + '">' + response.messages[i].message_text + '</strong>\
                                    ' + editedMessage(response.messages[i].edited) + '\
                                    <small class="d-block">' + response.messages[i].created_at + '</small>\
                                </div>\
                            </div>\
                        ');
                    }
                }

                $('.message-text').each(function() {
                    var $this = $(this);

                    $this.on("dblclick", function () {
                        $this.hide();

                        $this.before('\
                            <div class="input-group input-group-sm mt-2 mb-2">\
                                <input type="text" value="' + $this.html() + '" class="form-control message-edit">\
                            </div>\
                        ');

                        $('.message-edit').focus();

                        $('.message-edit').focusout(function() {
                            if($(this).val() != $this.html()) {
                                editMessage($this.data('id'), $(this).val());

                                $this.html($(this).val());

                                $this.append('<span class="badge badge-pill badge-light ml-1">edited</span>');
                            }

                            $(this).parent().remove();

                            $this.show();
                        });
                    });
                });
            } else {
                $('.messages').append('<h6 class="text-center">There are no messages in this chat</h6>');
            }
            
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