var express = require('express');
var router = express.Router();
var DataBaseHandler = require("../config/DataBaseHandler");
var dataBaseHandler = new DataBaseHandler();

var connection = dataBaseHandler.createConnection();

router.get('/', function(req, res, next) {
    res.render('register.jade');
});

router.post('/', function(req, res, next) {
    var sql = "INSERT INTO users (email, password) VALUES ?";
    var value = [
        [req.body.email, req.body.password]
    ];

    connection.query(sql, [value],
    function(err, results, fields) {
        if(err) throw err;

        res.status(201).redirect('/login');
    });
});

module.exports = router;
