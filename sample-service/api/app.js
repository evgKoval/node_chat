var express = require("express");
var bodyParser = require('body-parser');

var index = require('./routes/index');
var employee = require('./routes/employee');
var placelocation = require('./routes/placelocation');
var register = require('./routes/register');
var login = require('./routes/login.js');
const session = require('express-session');

var app = express();

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

let sess;

app.set("view engine", "jade");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use('/employee', employee);
app.use('/', index);
app.use('/placelocation', placelocation);
app.use('/register', register);
app.use('/login', login);

app.listen(8123);
