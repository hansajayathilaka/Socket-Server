let socket = null;

function wsInit(e) {
    e.preventDefault();
    debugger;
    if (socket) socket.disconnect();
    socket = io.connect('http://localhost:3000', {
        query: {
            email: myEmail.value,
        },
        auth: {
            token: token.value,
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

function wsNotify(e) {
    e.preventDefault();
    const payload = {
        to: otherEmail.value,
        from: myEmail.value,
        message: {
            a: 2
        }
    }
    socket.emit("notification:telehealth", payload, (temp) => {
        console.log(temp);
    });
    // socket.emit("notify", "asdf")
}
