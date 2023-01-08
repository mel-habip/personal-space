import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export default function authenticateToken(req, res, next) { //this is middleware in /login
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No session token received.');
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, ((err, user) => {
        if (err) res.status(403).send('Invalid Token');;
        req.user = user;
        next();
    }));
}