var express = require('express');
var router = express.Router();
var DataBaseHandler = require("../config/DataBaseHandler");
var dataBaseHandler = new DataBaseHandler();

var connection = dataBaseHandler.createConnection();

router.get('/', function (req, res, next) {
    connection.query("SELECT * FROM users",
    function(err, results, fields) {
        if(err) throw err;

        res.status(202).send({
            status : "SUCCESS",
            message: "Users was found",
            data : results
        });
    });
});

module.exports = router;