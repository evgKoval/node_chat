var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    sess = req.session;

    if(sess.user_id) {
        res.render('index.jade');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
