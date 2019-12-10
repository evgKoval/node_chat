const nodemailer = require('nodemailer');

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

exports.access = async function(request, response) {
    const roomId = request.body.room_id;
    const roomCreator = await Room.getCreatorByRoomId(roomId);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });

    const userId = request.body.user_id;
    const userName = request.body.user_name;
    const userEmail = request.body.user_email;
    const roomName = request.body.room_name;

    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: roomCreator.email,
        subject: 'Someone has wanted to join in your chat!',
        text: `${userName} (${userEmail}) just asked to join in your chat (${roomName}). To access ${userName} click this link http://192.168.99.101:8123/access/${roomId}/${userId}`
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            response.json({ 
                'email': 'Success'
            });
        }
    });
}

exports.confirm = async function(request, response) {
    const roomId = request.params.roomId;
    const userId = request.params.userId;

    const access = await Room.accessUserInRoom(roomId, userId);

    if(access.length == 0) {
        response.json({ 
            'access': 'User isn\'t accessed to chat'
        });
    }

    response.json({ 
        'access': 'User has accessed to chat'
    });
}