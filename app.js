const express = require("express");
const env = require('env2')(__dirname + '/.env');
const bodyParser = require('body-parser');
const router = require('./routes');
const fileupload = require('express-fileupload');

const session = require('express-session');

const app = express();

app.use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}));

app.set("view engine", "jade");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(fileupload());
app.use("/", router);

app.listen(3000);
