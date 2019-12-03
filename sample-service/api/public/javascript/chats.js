$(document).ready(function() {
    $('.room-item').first().addClass('active');

    $('.room-item').each(function() {
        var $this = $(this);

        $this.on("click", function () {
            $('.room-item').removeClass('active');

            $this.addClass('active');

            $.ajax({
                type: "GET",
                url: '/api/chat/' + $(this).data('id'),
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
        });
    });
});