var express = require('express');
var router = express.Router();
const session = require('express-session');
var DataBaseHandler = require("../config/DataBaseHandler");
var dataBaseHandler = new DataBaseHandler();

var connection = dataBaseHandler.createConnection();

router.get('/', function(req, res, next) {
    res.render('login.jade');
});



router.post('/', function(req, res, next) {
    sess = req.session;

    var sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    connection.query(sql, [req.body.email, req.body.password],
    function(err, results, fields) {
        if(err) throw err;

        if(!results) {
            res.status(404).redirect('/login');
        } else {
            console.log('login session', results[0].id);
            sess.user_id = results[0].id
        }

        res.status(200).redirect('/');
    });
});

module.exports = router;