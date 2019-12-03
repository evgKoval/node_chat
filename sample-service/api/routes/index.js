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

router.get('/api/chat/:id', ChatController.show);

module.exports = router;