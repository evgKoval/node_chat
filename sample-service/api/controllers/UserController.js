const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const User = require("../models/user.js");
 
exports.login = function (request, response) {
    if(request.session.user_id) {
        response.redirect('back');
    } else {
        response.render('login.jade');
    }
};

exports.register = function(request, response) {
    if(request.session.user_id) {
        response.redirect('back');
    } else {
        response.render('register.jade', {
            user: request.session.user_id
        });
    }
};

exports.edit = async function(request, response) {
    const userId = request.session.user_id;
    if(!userId) {
        response.redirect('back');
    } else {

        response.render('profile.jade', {
            'userId': userId,
            'userData': await User.getPersonalData(userId)
        });
    }
}

exports.update = async function(request, response) {
    const userId = request.session.user_id;

    const filedata = request.files.avatar;
    filedata.name = userId + '_' + filedata.name;
    
    var base64data = Buffer.from(filedata.data, 'binary');

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filedata.name,
        Body: base64data,
        ACL: 'public-read'
    };

    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });

    // const path = __dirname + '/../public/images/' + filedata.name
    
    // request.files.avatar.mv(path);

    const profileName = request.body.name;
    const profileEmail = request.body.email;
    const profileAvatar = request.body.avatar_name;

    response.json({
        'profile': await User.updateProfile(userId, profileName, profileEmail, profileAvatar)
    })
}

exports.logout = function(request, response) {
    request.session.user_id = null;

    response.redirect('/login');
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