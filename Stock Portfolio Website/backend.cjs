const PORT = 8000;

const DOMAIN = `http://localhost:${PORT}`;

const axios = require('axios');
const express = require('express');
const APP = express();
const fs = require('fs');

const cors = require('cors');
const { log } = require('console'); 

let counter1 = 0;
let counter2 = 0;

APP.use(cors());

APP.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`));

APP.get('/', (req, res) => {
    counter1++
    console.log('requested', counter1);
    res.json('Hello World!');
});

APP.get('/api/validate_user', (req, res) => {
    let all_users = require('./databases/users');

    let current_user = all_users.find(user => user.username === req.query?.username);
    res.json(current_user);
});

APP.post('/api/create_new_user/', (req, res) => {
    counter2++
    console.log('creation requested', counter2);

    let all_users = require('./databases/users.json');
    log(req.body);
    log(req.query);
    log(req.params);
    all_users.push({
        id: 5,
        username: 'tester',
        pass: 'tester'
    });
    try {
        fs.writeFileSync('./databases/users.json', JSON.stringify(all_users, undefined, 4));
    } catch (err) {
        res.json(false);
    } finally {
        res.json(true);
    }
})