import * as dotenv from 'dotenv';
import path from 'path';
import express, { Request, Response } from 'express';
import http from 'http';
import socket  from 'socket.io';
import * as jwt from 'jsonwebtoken';
import {Users} from "./utils/Users";
import {Socket, TokenData, TelehealthNotificationPayload} from "types";
import logger from './utils/Logger';
import morganMiddleware from './utils/MorganMiddleware'
import {sendFCM} from "./utils/Firebase";

logger.info('Starting server');
dotenv.config();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT! || 3000;

let app = express();
let server = http.createServer(app);
// @ts-ignore
let io = socket(server, {
    cors: {
        origin: process.env.FRONT_END_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Morgan Logging
// app.use(morgan('dev'));
app.use(morganMiddleware);

app.use('/static', express.static(publicPath));
app.get('/firebase-messaging-sw.js', (req: Request, res: Response): void => {
    console.log(req.url);
    res.sendFile('firebase-messaging-sw.js', { root: publicPath });
});
app.get('/*', (req: Request, res: Response): void => {
    console.log(req.url);
    res.sendFile('index.html', { root: publicPath });
});

const users: Users = new Users();

io.use((socket: Socket, next: any) => {
    // @ts-ignore
    if (socket.handshake.auth && socket.handshake.auth.token && socket.handshake.query.email){
        // @ts-ignore
        const token: string = socket.handshake.auth.token,
            email: string = socket.handshake.query.email;
        try {
            let decodedToken: TokenData;
            // TODO: Change Algorithm to RS256 (Asymmetric Encryption)
            const decodedTokenString: object | string = jwt.verify(token, process.env.JWT_KEY || "Token", {algorithms: ['HS256']});
            if (typeof decodedTokenString == "string") {
                decodedToken = <TokenData>JSON.parse(decodedTokenString);
            } else {
                decodedToken = <TokenData>decodedTokenString;
            }

            console.log(decodedToken);
            if (decodedToken.user_id === email) {
                socket.email = email;
                logger.info(`New secured connection from ${email}`);
                next();
            } else {
                logger.warn(`Invalid email from ${email}, ${decodedToken.user_id}.`);
                // socket.disconnect(true);
                next(Error('Authentication error'));
            }
        } catch (e) {
            logger.warn(`Invalid token from ${email}.`);
            // socket.disconnect(true);
            next(new Error(e.message));
        }
    }
    else {
        logger.warn(`Invalid socket connection.`);
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket: Socket) => {
    console.log('A new user is Connected.');
    // Users.set(socket.email, socket);
    socket.join(socket.email);
    users.addNewUser(socket);

    socket.on('notify', (params: any, cb: any) => {
        console.log(params);
        console.log(socket.email);
        cb('ok');
    });

    socket.on('notification:telehealth', (payload: TelehealthNotificationPayload, cb: (arg0: any) => void) => {
        socket.to(payload.to).emit('notification:telehealth', payload);
        sendFCM([payload.token], 'Title', 'Body');
        cb('ok');
    });

    // Disconnected
    socket.on('disconnect', (reason) => {
        logger.info(`Disconnected the connection of ${socket.email}`);
        // console.log('A user is Disconnected', reason);
        // Users.delete(socket.email);
        users.removeUser(socket)
    });
});

io.on('error', (doc: any) => {
    console.log(doc);
})

// Listen
server.listen(port, () => {
    logger.info(`Server is up on port ${port}.`);
}).on('error', (e) => {
    logger.error(`Error while listing to the port ${port}.`);
    logger.error(JSON.stringify(e));
});
