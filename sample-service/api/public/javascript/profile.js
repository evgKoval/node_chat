$(document).ready(function() {
    var userId = location.href.substring(location.href.lastIndexOf('/') + 1);

    var fileName = $('.avatar').css("backgroundImage");
    fileName = fileName.match(/[\w\.\$]+(?=png|jpg|gif)\w+/g)[0];

    var file = null;

    $(".custom-file-input").on("change", function() {
        fileName = $(this).val().split("\\").pop();

        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);

        fileName = userId + '_' + fileName;
    });

    $('input[type=file]').on('change', function(){
        file = this.files;
        handleFileSelect(file);
    });

    $('.edit-profile').on('click', function(e) {
        e.preventDefault();

        var name = $('input[name="name"]').val();
        var email = $('input[name="email"]').val();

        if(name == '' || email == '') return;

        form = new FormData();

        form.set('avatar', file[0]);
        form.set('name', name);
        form.set('email', email);
        form.set('avatar_name', fileName);

        $.ajax({
            type: "PUT",
            url: '/profile/' + userId,
            data: form,
            processData: false,
            contentType: false,
            //contentType: 'multipart/form-data',
            success: function (response) {
                console.log(response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    })
});
  
function handleFileSelect(files){
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsDataURL(files[0]);
}
  
function handleFileLoad(event){
    $('.avatar').css('background-image', 'url(' + event.target.result + ')');
}