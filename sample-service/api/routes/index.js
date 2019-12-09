const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const MainController = require('../controllers/MainController');
const ChatController = require('../controllers/ChatController');
const RoomController = require('../controllers/RoomController');

router.get('/', MainController.index);

router.get('/login', UserController.login);
router.post('/login', UserController.logining);

router.get('/register', UserController.register);
router.post('/register', UserController.store);

router.get('/profile/:id', UserController.edit);
router.put('/profile/:id', UserController.update);
router.post('/logout', UserController.logout);

router.get('/api/room/:id', RoomController.show);
router.put('/api/room', RoomController.update);

router.get('/api/chat/:id', ChatController.show);
router.post('/api/chat', ChatController.store);
router.post('/api/chat/message', ChatController.message);
router.put('/api/chat/message', ChatController.update);
router.delete('/api/chat/message', ChatController.destroy);

module.exports = router;