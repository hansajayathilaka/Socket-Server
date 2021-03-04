import { Socket as SocketType } from "socket.io";


export interface TokenData {
    email: string;
}

export interface Socket extends Omit<SocketType, 'handshake'> {
    email: string;
    handshake: any;
}

export interface User {
    id: string;
    email: string;
    sockets: Set<Socket>;
}

export interface TelehealthNotificationPayload {
    to: string;
    from: string;
    message: any;
}
