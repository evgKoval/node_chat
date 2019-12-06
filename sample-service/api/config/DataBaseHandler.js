var mysql = require("mysql");

function DataBaseHandler() {
    this.connection = null;
}

DataBaseHandler.prototype.createConnection = function () {

    this.connection = mysql.createConnection({
        host: '192.168.10.10',
        user: 'homestead',
        password: 'secret',
        database: 'nodeapp',
        port: 3306,
        charset: 'utf8mb4'
    });

    this.connection.connect(function (err) {
        if (err) {
            console.error("error connecting " + err.stack);
            return null;
        }
        console.log("connected as id " + this);
    });
    return this.connection;
};

module.exports = DataBaseHandler;