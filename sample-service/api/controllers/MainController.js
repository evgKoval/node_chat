const Room = require("../models/room.js");
const User = require("../models/user.js");

exports.index = async function (request, response) {
    const userId = request.session.user_id;

    if(userId) {
        const email = request.session.email;
        const rooms =  await Room.all();
        const users = await User.all();
        const userData = await User.getPersonalData(userId);

        response.render('index.jade', {
            userData: userData,
            user: email,
            userId: userId,
            users: users,
            rooms: rooms
        });
    } else {
        response.redirect('/login');
    }
};