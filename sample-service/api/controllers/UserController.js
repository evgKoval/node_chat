const User = require("../models/user.js");
 
exports.login = function (request, response) {
    response.render('login.jade');
};

exports.register = function(request, response) {
    response.render('register.jade', {
        user: request.session.user_id
    });
};

exports.store = function(request, response) {
    const email = request.body.email;
    const password = request.body.password;

    const user = new User(email, password);
    user.save();

    response.redirect('/login');
};

exports.logining = async function(request, response) {
    const email = request.body.email;
    const password = request.body.password;

    await User.checkEmail(email, password)
        .then((user) => {
            if(user) {
                request.session.user_id = user.id
                request.session.email = user.email
                response.redirect('/');
            } else {
                response.redirect('/login');
            }
        });
}