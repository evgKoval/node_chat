var mysql = require("mysql");

function DataBaseHandler() {
    this.connection = null;
}

DataBaseHandler.prototype.createConnection = function () {

    this.connection = mysql.createConnection({
        host: process.env.RDS_HOSTNAME, //|| '192.168.10.10',
        user: process.env.RDS_USERNAME, //|| 'homestead',
        password: process.env.RDS_PASSWORD, //|| 'secret',
        database: process.env.RDS_DATABASE, //|| 'nodeapp',
        port: process.env.RDS_PORT, //|| 3306,
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