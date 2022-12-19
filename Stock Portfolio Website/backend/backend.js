const PORT = 8000;

const DOMAIN = `http://localhost:${PORT}`;


import { axios } from 'axios';
import {
    express
} from 'express';
import {
    cors
} from 'cors';
import * as fs from fs;
const log = console.log;



const APP = express(); //creating and starting the server
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
    log(req.query);
    all_users.push({
        id: all_users.length,
        username: req.query.username,
        password: req.query.password
    });
    try {
        fs.writeFileSync('./databases/users.json', JSON.stringify(all_users, undefined, 4));
    } catch (err) {
        res.json(false);
    } finally {
        res.json(true);
    }
});