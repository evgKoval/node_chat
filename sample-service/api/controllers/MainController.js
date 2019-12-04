const Room = require("../models/room.js");
const User = require("../models/user.js");

exports.index = async function (request, response) {
    const userId = request.session.user_id;

    if(userId) {
        const email = request.session.email;
        const rooms =  await Room.ownRooms(userId);
        const users = await User.all();

        response.render('index.jade', {
            user: email,
            userId: userId,
            users: users,
            rooms: rooms
        });
    } else {
        response.redirect('/login');
    }
};