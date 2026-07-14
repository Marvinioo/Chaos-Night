const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const lobbies = {};

app.use(express.static(path.join(__dirname, "../Client")));

function createCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

io.on("connection", (socket) => {

    socket.on("createLobby", (name) => {
        const code = createCode();

        lobbies[code] = {
            players: [{ id: socket.id, name }]
        };

        socket.join(code);

        socket.emit("lobbyCreated", { code });

        io.to(code).emit(
            "updatePlayers",
            lobbies[code].players.map(p => p.name)
        );
    });

    socket.on("joinLobby", ({ code, name }) => {

        if (!lobbies[code]) return;

        lobbies[code].players.push({
            id: socket.id,
            name
        });

        socket.join(code);

        io.to(code).emit(
            "updatePlayers",
            lobbies[code].players.map(p => p.name)
        );
    });

    socket.on("disconnect", () => {

        for (const code in lobbies) {

            lobbies[code].players =
                lobbies[code].players.filter(
                    p => p.id !== socket.id
                );

            io.to(code).emit(
                "updatePlayers",
                lobbies[code].players.map(p => p.name)
            );

            if (lobbies[code].players.length === 0) {
                delete lobbies[code];
            }
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});