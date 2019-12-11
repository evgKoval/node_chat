var DataBaseHandler = require("../config/DataBaseHandler");
var dataBaseHandler = new DataBaseHandler();

// var MongoDB = require('../config/MongoDB');
// var mongoDB = new MongoDB();

var connection = dataBaseHandler.createConnection();
// var connectionMongo = null; 
// mongoDB.createConnection().then(res => {
//     connectionMongo = res;
// });
 
module.exports = class Room {
    static all() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM rooms";
            connection.query(sql,
                function(err, results) {
                    if(err) reject(err);

                    if(!results) {
                        resolve(null);
                    }

                    resolve(results);
                }
            )
        });
    }

    static ownRooms(userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT r.id, r.name, r.created_by FROM rooms r LEFT JOIN chat_users c ON c.room_id = r.id";
            connection.query(sql,
                function(err, results) {
                    if(err) reject(err);

                    if(!results) {
                        resolve(null);
                    }

                    resolve(results);
                }
            )
        });
    }

    static getRoomById(roomId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT r.name, c.user_id FROM rooms r LEFT JOIN chat_users c ON r.id = c.room_id WHERE r.id = ?";
            connection.query(sql, roomId,
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

    static getAccess(roomId, userId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM chat_users WHERE room_id = ? AND user_id = ?';

            connection.query(sql, [roomId, userId],
                function(err, results) {
                    if(err) reject(err);

                    if(results.length == 0) {
                        resolve(false);
                    }

                    resolve(true);
                }
            );
        })
    }

    static getCreatorByRoomId(roomId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT u.email FROM rooms r LEFT JOIN users u ON u.id = r.created_by WHERE r.id = ?';

            connection.query(sql, roomId,
                function(err, results) {
                    if(err) reject(err);

                    resolve(results[0]);
                }
            );
        })
    }

    static getRoomMessages(userId, roomId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT m.id, m.created_at, m.message_text, m.edited, m.message_type, u.email, u.name, u.avatar, IF(m.user_id = ?, "true", "false") AS own FROM messages m LEFT JOIN users u ON m.user_id = u.id WHERE m.room_id = ? ORDER BY m.created_at';
            connection.query(sql, [userId, roomId],
                function(err, results) {
                    if(err) reject(err);

                    if(!results) {
                        resolve(null);
                    }

                    resolve(results);
                }
            );

            // const dbo = connectionMongo.db("myapp");
            // dbo.collection("messages").find({}).toArray(function(err, result) {
            //     if (err) throw err;
            // });
        })
    }

    static getMessageById(messageId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM messages WHERE id = ?' ;

            connection.query(sql, messageId,
                function(err, results) {
                    if(err) reject(err);

                    if(!results) {
                        resolve(null);
                    }

                    resolve(results[0]);
                }
            )
        })
    }

    static sendMessage(userId, roomId, message, messageType = 'text') {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO messages (user_id, room_id, message_text, message_type) VALUES ?;';
            const values = [
                [userId, roomId, message, messageType]
            ];
            
            connection.query(sql, [values],
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

            // const data = {
            //     created_at: new Date(),
            //     message_text: message,
            //     room_id: parseInt(roomId),
            //     user_id: userId,
            //     edited: 0
            // };

            // const dbo = connectionMongo.db("myapp");
            // dbo.collection("messages").insertOne(data, function(err, res) {
            //     if (err) throw err;
            // });
        })
    }

    static editMessage(messageId, messageText) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE messages SET message_text = ?, edited = 1 WHERE id = ?;';
            const values = [messageText, messageId];
            
            connection.query(sql, values,
                function(err, results) {
                    if(err) reject(err);

                    resolve(results);
                }
            )
        })
    }

    static deleteMessage(messageId) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM messages WHERE id = ?;';
            
            connection.query(sql, messageId,
                function(err, results) {
                    if(err) reject(err);

                    resolve(results);
                }
            )
        })
    }

    static createRoom(userId, roomName) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO rooms (created_by, name) VALUES ?;';
            const values = [
                [userId, roomName]
            ];

            connection.query(sql, [values],
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

    static joinUsersToRoom(roomId, roomUsers) {
        return new Promise((resolve, reject) => {
            let result = [];
            roomUsers.forEach((user) => {
                const sql = 'INSERT INTO chat_users (room_id, user_id) VALUES ?;';
                const values = [
                    [roomId, user]
                ];

                connection.query(sql, [values],
                    function(err, results) {
                        if(err) reject(err);
    
                        if(!results) {
                            result = null;
                        }
    
                        result = results;
                    }
                )
            });

            resolve(result);
        })
    }

    static accessUserInRoom(roomId, userId) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO chat_users (room_id, user_id) VALUES ?';
            const values = [
                [roomId, userId]
            ];

            connection.query(sql, [values],
                function(err, results) {
                    if(err) reject(err);

                    resolve(results);
                }
            )
        })
    }
}