const Room = require("../models/room.js");

exports.show = async function (request, response) {
    const userId = request.session.user_id;
    const roomId = request.params.id;

    response.json({ 
        'messages': await Room.getRoomMessages(userId, roomId)
    });
};