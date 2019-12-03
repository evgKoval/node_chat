var DataBaseHandler = require("../config/DataBaseHandler");
var dataBaseHandler = new DataBaseHandler();

var connection = dataBaseHandler.createConnection();
 
module.exports = class Room {
    // constructor(email, password){
    //     this.email = email;
    //     this.password = password;
    // }

    // save() {
    //     const sql = "INSERT INTO users (email, password) VALUES ?";
    //     const value = [
    //         [this.email, this.password]
    //     ];

    //     connection.query(sql, [value],
    //         function(err, results, fields) {
    //             if(err) throw err;

    //             res.status(201);
    //         }
    //     );
    // }

    static all() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT name FROM rooms";
            connection.query(sql,
                function(err, results) {
                    if(err) throw err;

                    if(!results) {
                        return null;
                    }

                    resolve(results);
                    return results
                }
            )
        });
    }

    static ownRooms(userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id, name FROM rooms r LEFT JOIN chat_users c ON c.room_id = r.id WHERE c.user_id = ?";
            connection.query(sql, [userId],
                function(err, results) {
                    if(err) reject(err);

                    if(!results) {
                        resolve(null);
                        //return null;
                    }

                    resolve(results);
                    //return results;
                }
            )
        });
    }

    static getRoomMessages(userId, roomId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT m.created_at, m.message_text, u.email, IF(m.user_id = ?, "true", "false") AS own FROM messages m LEFT JOIN users u ON m.user_id = u.id WHERE m.room_id = ?';
            connection.query(sql, [userId, roomId],
                function(err, results) {
                    if(err) reject(err);

                    if(!results) {
                        resolve(null);
                        //return null;
                    }

                    resolve(results);
                    //return results;
                }
            )
        })
    }
}