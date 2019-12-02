const session = require('express-session');
var DataBaseHandler = require("../config/DataBaseHandler");
var dataBaseHandler = new DataBaseHandler();

var connection = dataBaseHandler.createConnection();
 
module.exports= class User {
    constructor(email, password){
        this.email = email;
        this.password = password;
    }

    save() {
        const sql = "INSERT INTO users (email, password) VALUES ?";
        const value = [
            [this.email, this.password]
        ];

        connection.query(sql, [value],
            function(err, results, fields) {
                if(err) throw err;

                res.status(201);
            }
        );
    }

    static checkEmail(email, password) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
            connection.query(sql, [email, password],
                function(err, results) {
                    if(err) throw err;
                    resolve(results[0]);
                    if(!results) {
                        return null;
                    }

                    return results[0]
                }
            );
        })
    }
}