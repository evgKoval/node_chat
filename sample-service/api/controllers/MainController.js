const Room = require("../models/room.js");

exports.index = async function (request, response) {
    const userId = request.session.user_id;

    if(userId) {
        const email = request.session.email;
        const rooms =  await Room.ownRooms(userId);

        response.render('index.jade', {
            user: email,
            rooms: rooms
        });
    } else {
        response.redirect('/login');
    }
};