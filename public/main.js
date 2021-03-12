let socket = null;

function wsInit() {
    debugger;
    if (socket) socket.disconnect();
    socket = io.connect('http://localhost:3000', {
        query: {
            email: idMyEmail.value,
        },
        auth: {
            token: idToken.value,
        }
    });

    // This will not fire on socket is disconnected by server.
    socket.on("connect_error", () => {
        setTimeout(() => {
            socket.connect();
        }, 1000);
    });

    socket.on("connect", () => {
        console.log(socket.id);
    });

    socket.on("disconnect", () => {
        console.log(socket.id);
    });

    socket.on("notification:telehealth", (params) => {
        console.log(params);
    });
}

function wsNotify() {
    const payload = {
        to: idOtherEmail.value,
        from: idMyEmail.value,
        message: {
            a: 2
        },
        token: token
    }
    socket.emit("notification:telehealth", payload, (temp) => {
        console.log(temp);
    });
}

function Initialization(e){
    e.preventDefault();
    wsInit();
}

function SendNotification(e){
    e.preventDefault();
    wsNotify()
}
