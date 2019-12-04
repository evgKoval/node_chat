const Room = require("../models/room.js");

exports.show = async function (request, response) {
    const userId = request.session.user_id;
    const roomId = request.params.id;

    response.json({ 
        'messages': await Room.getRoomMessages(userId, roomId)
    });
};

exports.store = async function(request, response) {
    const userId = request.session.user_id;
    const roomName = request.body.name;
    const roomUsers = request.body.users || [];

    const roomId = await Room.createRoom(userId, roomName);
    
    roomUsers.push(userId);
    
    await Room.joinUsersToRoom(roomId.insertId, roomUsers);

    response.json({
        'room_name': roomName,
        'room_id': roomId.insertId
    })
}

exports.message = async function(request, response) {
    const userId = request.session.user_id;
    const roomId = request.body.room;
    const message = request.body.message;

    response.json({
        'message': await Room.sendMessage(userId, roomId, message)
    })
}

exports.update = async function(request, response) {
    const messageId = request.body.message_id;
    const messageText = request.body.message_text;

    response.json({
        'message': await Room.editMessage(messageId, messageText)
    })
}