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

    static all() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT u.id, u.email FROM users u";
            connection.query(sql,
                function(err, results) {
                    if(err) reject(err);

                    if(!results) {
                        resolve(null);
                    }

                    resolve(results);
                }
            );
        })
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

    static getPersonalData(userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT name, email, avatar FROM users WHERE id = ?";
            connection.query(sql, userId,
                function(err, results) {
                    if(err) reject(err);

                    if(!results) {
                        resolve(null);
                    }
                    
                    resolve(results[0]);
                }
            );
        })
    }

    static updateProfile(userId, profileName, profileEmail, profileAvatar) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?;";
            const values = [profileName, profileEmail, profileAvatar, userId];

            connection.query(sql, values,
                function(err, results) {
                    if(err) reject(err);
                    
                    resolve(results);
                }
            );
        })
    }
}