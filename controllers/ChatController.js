const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const Room = require("../models/room.js");

exports.show = async function (request, response) {
    const userId = request.session.user_id;
    const roomId = request.params.id;
    let messages = null;

    const access = await Room.getAccess(roomId, userId);

    if(access) {
        messages = await Room.getRoomMessages(userId, roomId);
    }

    response.json({ 
        'messages': messages
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

    const insertId = await Room.sendMessage(userId, roomId, message);

    response.json({
        'message': await Room.getMessageById(insertId.insertId)
    })
}

exports.update = async function(request, response) {
    const messageId = request.body.message_id;
    const messageText = request.body.message_text;

    response.json({
        'message': await Room.editMessage(messageId, messageText)
    })
}

exports.destroy = async function(request, response) {
    const messageId = request.body.message_id;

    response.json({
        'message': await Room.deleteMessage(messageId)
    })
}

exports.file = async function(request, response) {
    const userId = request.session.user_id;

    const filedata = request.files.message_file;
    filedata.name = request.body.time + '_' + filedata.name;
    
    var base64data = Buffer.from(filedata.data, 'binary');

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: 'messages/' + filedata.name,
        Body: base64data,
        ACL: 'public-read'
    };

    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });

    const roomId = request.body.room_id;
    const messageType = request.body.message_type;

    const insertId = await Room.sendMessage(userId, roomId, filedata.name, messageType)

    response.json({
        'message': await Room.getMessageById(insertId.insertId)
    })
}