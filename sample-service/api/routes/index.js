const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const MainController = require('../controllers/MainController');
const ChatController = require('../controllers/ChatController');

router.get('/', MainController.index);

router.get('/login', UserController.login);
router.post('/login', UserController.logining);

router.get('/register', UserController.register);
router.post('/register', UserController.store);

router.post('/logout', UserController.logout);

router.get('/api/chat/:id', ChatController.show);
router.post('/api/chat', ChatController.store);
router.post('/api/chat/message', ChatController.message);
router.put('/api/chat/message', ChatController.update);
router.delete('/api/chat/message', ChatController.destroy);

module.exports = router;