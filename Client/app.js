alert("app.js wurde geladen");const socket = io();

const createLobbyBtn = document.getElementById("createLobby");
const joinLobbyBtn = document.getElementById("joinLobby");
const playerName = document.getElementById("playerName");
const roomCode = document.getElementById("roomCode");
const lobby = document.getElementById("lobby");
const playerList = document.getElementById("playerList");

createLobbyBtn.addEventListener("click", () => {
    const name = playerName.value.trim();

    if (!name) {
        alert("Bitte gib zuerst einen Namen ein.");
        return;
    }

    socket.emit("createLobby", name);
});

joinLobbyBtn.addEventListener("click", () => {
    const code = prompt("Lobby-Code eingeben:");

    if (!code) return;

    const name = playerName.value.trim();

    if (!name) {
        alert("Bitte gib zuerst einen Namen ein.");
        return;
    }

    socket.emit("joinLobby", {
        code,
        name
    });
});

socket.on("lobbyCreated", (data) => {
    lobby.classList.remove("hidden");
    roomCode.innerText = data.code;
});

socket.on("updatePlayers", (players) => {
    playerList.innerHTML = "";

    players.forEach((player) => {
        const li = document.createElement("li");
        li.innerText = player.name;
        playerList.appendChild(li);
    });
});