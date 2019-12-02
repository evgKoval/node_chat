var express = require("express");
var bodyParser = require('body-parser');
const router = require('./routes');

const session = require('express-session');

var app = express();

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

app.set("view engine", "jade");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use("/", router);

app.listen(8123);
