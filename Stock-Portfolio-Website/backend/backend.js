const PORT = 8000;
const DOMAIN = `http://localhost:${PORT}`;

// import {
//     axios
// } from 'axios';
import mysql from 'mysql';
import jwt from 'jsonwebtoken';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as url from 'url';
import authenticateToken from './jobs/authenticateToken.js'
import validateUser from './jobs/validateUser.js'
import find_local_file from './jobs/find_local_file.js';
import bcrypt from 'bcrypt';

const __dirname = url.fileURLToPath(new URL('.',
    import.meta.url)); //this is merely a workaround for the __dirname which is not available inside of an ES module
const env_dir = find_local_file(__dirname, '.env', ['Desktop', 'Documents', 'Users']);
dotenv.config({
    path: env_dir
});
const log = console.log;



// const con = mysql.createConnection({
//     host: "localhost",
//     user: "yourusername",
//     password: "yourpassword",
//     database: 'mydb'
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
// });

const APP = express(); //creating and starting the server
APP.use(cors());
APP.use(express.json());

const posts = [{
        user: 'Kyle',
        title: 'Post 1'
    },
    {
        user: 'Jim',
        title: 'Post 2'
    }
];

APP.get('/posts', authenticateToken, (req, res) => {
    log(req.user);

    if (req.user.permissions === 'total') return res.status(200).json(posts);
    return res.status(200).json(posts.filter(post => post.user === req.user?.username));
})

APP.get('/', (req, res) => {
    res.json('Hello World!');
});

APP.get('/api/show_all_users', authenticateToken,(req, res) => {

    if (req.user.permissions !== 'total') return res.status(403).send('You do not have access to this.');
    let sql = `SELECT * FROM Users`;
    let results = con.query(sql, function (err, result) {
        if (err) throw err;
        log("here you go", result);
    });
    res.json(results);
});

APP.post('/api/create_new_user/', async (req, res) => {
    log('received: ', req.body || {});
    
    let sql = `SELECT * FROM Users WHERE Username = '${req.body.username}'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        log('result', result);
        if (result?. [0]) {
            log(`Username ${req.body.username} already in use`);
            return res.status(401).json(`Username ${req.body.username} already in use`);
        };
    });
    try {
        //hashed = encrypted
        //encription uses a "Salt" that is generated uniquely for each password. The salt is prepended to the hashed password and functions as the key to decrypt it later on.
        const hashedPassword = await bcyprt.hash(req.body.password, 10); //default strength for salt creation is 10
        
        let sql = `INSERT INTO Users (Username, Password, FirstName, LastName, Permissions) VALUES ('${req.body.username}', '${hashedPassword}','${req.body.FirstName}','${req.body.LastName}', 'basic_user')`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            log("1 record inserted", result);
            //Do we want to then create a table specifically for that user and their data?
        });
        return res.status(201).send('Successfully created');
    } catch (err) {
        res.status(422).send(err)
    }
});

APP.post('/users/login', (req, res) => {

    log('received: ', req.body || {});

    // let user_details = validateUser(req.body?.username, req.body?.password, con);

    let user_details = { //until DB config is complete, for testing
        Permissions: 'total'
    };
    
    const user = {
        username: req.body?.username,
        permissions: user_details.Permissions
    };

    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY);

    res.json({
        access_token
    });
});




APP.get('/validate_login', (req, res) => {
    let sql = `SELECT Username, Password FROM Users WHERE Username = '${req.body.username}'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        log('result', result);
        if (!result?. [0]) {
            log("Username not recognized");
            res.json('Username not recognized');
            return false; //does this do anything or does res.json mark the end?
        };
        sql = `SELECT * FROM Users WHERE Username = '${req.body.username}' AND Password = '${req.body.password}'`;
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

APP.listen(PORT, 'localhost', () => console.log(`Server Running on PORT ${PORT}`));