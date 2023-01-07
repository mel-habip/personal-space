const PORT = 8000;
const DOMAIN = `http://localhost:${PORT}`;

import {
    axios
} from 'axios';
import mysql from 'mysql';
import * as jwt from 'jsonwebtoken';
import {
    express
} from 'express';
import {
    cors
} from 'cors';
import dotenv from 'dotenv';
import * as fs from fs;

dotenv.config();
const log = console.log;

const con = mysql.createConnection({
    host: "localhost",
    user: "yourusername",
    password: "yourpassword",
    database: 'mydb'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

const APP = express(); //creating and starting the server
APP.use(cors());

const posts = [
    {
        user: 'Kyle',
        title: 'Post 1'
    },
    {
        user: 'Jim',
        title: 'Post 2'
    }
];

APP.get('/posts', (req, res) => {
    res.json(posts);
})

APP.get('/', (req, res) => {
    res.json('Hello World!');
});

APP.get('/api/show_all_users', (req, res) => {
    let sql = `SELECT * FROM Users`;
    let results = con.query(sql, function (err, result) {
        if (err) throw err;
        log("here you go", result);
    });
    res.json(results);
});

APP.post('/api/create_new_user/', (req, res) => {
    let sql = `SELECT * FROM Users WHERE Username = '${req.data.username}'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        log('result', result);
        if (result?. [0]) {
            log(`Username ${req.data.username} already in use`);
            res.json(`Username ${req.data.username} already in use`);
            return false; //does this do anything or does res.json mark the end?
        };

    });
    sql = `INSERT INTO Users (Username, Password, FirstName, LastName, Permissions) VALUES ('${req.data.username}', '${req.data.password}','${req.data.FirstName}','${req.data.LastName}','${req.data.permissions}')`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        log("1 record inserted", result);
        //Do we want to then create a table specifically for that user?
    });
    log(req.query);
    res.json('Created 1 record');
});

APP.post('/login', (req, res) => {
    // TODO: Authenticate user

    const username = req.user.username;

    const user = {name: username};

    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY);

    res.json({
        access_token
    });
});


APP.get('/validate_login', (req, res) => {
    let sql = `SELECT Username, Password FROM Users WHERE Username = '${req.data.username}'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        log('result', result);
        if (!result?. [0]) {
            log("Username not recognized");
            res.json('Username not recognized');
            return false; //does this do anything or does res.json mark the end?
        };
        sql = `SELECT Username, Password FROM Users WHERE Username = '${req.data.username}' AND Password = '${req.data.password}'`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            log('result', result);
            if (!!result?. [0]) {
                res.json('Incorrect Password');
            };
            res.json(`Welcome home ${result[0].FirstName} ${result[0].LastName}! `);
        });

    });
});

APP.get('/api/get_all_positions', (req, res) => {
    let sql = `SELECT ` //TODO: finsih this
});

APP.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`));