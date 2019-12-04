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
                            <strong>' + message + '</strong>\
                            <br>\
                            <small>recently</small>\
                        </div>\
                        <img src="/images/avatar.png" class="ml-3" width="48" height="48">\
                    </div>\
                ');

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
    })
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
                                    <strong>' + response.messages[i].message_text + '</strong>\
                                    <br>\
                                    <small>' + response.messages[i].created_at + '</small>\
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
                                    <strong>' + response.messages[i].message_text + '</strong>\
                                    <br>\
                                    <small>' + response.messages[i].created_at + '</small>\
                                </div>\
                            </div>\
                        ');
                    }
                }
            } else {
                $('.messages').append('<h6 class="text-center">There are no messages in this chat</h6>');
            }
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}