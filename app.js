const express = require('express');
const { validate } = require("uuid");
const { v4: uuidv4 } = require("uuid");
const path = require('path');
const mysql = require('mysql');
const session = require("express-session");
const bodyParser = require('body-parser');
const encoder = bodyParser.urlencoded();

const app = express();

const port = process.env.PORT || 9000;

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.json());
// Parse URL-encoded bodies(as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));

// MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'prit',
    password: 'student7',
    database: 'prit'
});

//connect to the db
connection.connect((err) => {
    if (err) throw err;
    else console.log('connect');
});

app.post('/', encoder, (req, res) => {

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    connection.query("SELECT * FROM customers WHERE username = ? AND email = ? AND password = ?", [username, email, password], (err, results, fields) => {
        if (results.length > 0) {
            res.redirect('/dashboard');
            // res.send(req.body);
        } else {
            res.redirect('/');
        }
        res.end();
    });

});

// main page route
app.get('/', (req, res) => {
    res.render('base', { title: "Register Page" });
});

// dashboard route
app.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: "Dashboard Page" });
});

app.listen(port, () => {
    console.log("Losting to the server on http://localhost:9000");
});