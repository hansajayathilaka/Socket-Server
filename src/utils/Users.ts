import {Socket, User} from "types";

export class Users {
    private usersMap = new Map();

    constructor() {

    }

    addNewUser(socket: any) {
        if (this.usersMap.has(socket.email)){
            this.usersMap.get(socket.email).sockets.add(socket);
        } else {
            const user: User = {
                id: socket.id,
                email: socket.email,
                sockets: new Set([socket]),
            }
            this.usersMap.set(user.email, user)
        }
    }

    removeUser(socket: Socket) {
        const sockets = this.usersMap.get(socket.email).sockets;
        sockets.delete(socket);
    }

    getUserById() {

    }
}
