exports.index = function (request, response) {
    if(request.session.user_id) {
        response.render('index.jade', {
            user: request.session.email
        });
    } else {
        response.redirect('/login');
    }
};