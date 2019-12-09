const Room = require("../models/room.js");

exports.show = async function(request, response) {
    const roomId = request.params.id;

    response.json({ 
        'room': await Room.getRoomById(roomId)
    });
};

exports.update = async function(request, response) {
    const roomId = request.body.id;
    const roomName = request.body.name;
    const roomUsers = request.body.users;

    response.json({
        'profile': await User.updateProfile(roomId, roomName, roomUsers)
    })
}