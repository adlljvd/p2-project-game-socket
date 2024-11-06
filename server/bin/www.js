const http = require('http');
const { Server } = require('socket.io');
const app = require('../app');

const PORT = process.env.PORT || 3024;
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

let drawingState = [];
let chatHistory = [];
let typingPlayers = new Map();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send initial state to the connected client
    socket.emit("drawing-state", drawingState);
    socket.emit("chat-history", chatHistory);
    socket.emit("player-joined", Array.from(typingPlayers.values()));

    // Chat message handling
    socket.on("send-message", (messageData) => {
        const messageWithId = {
            ...messageData,
            id: Date.now(),
            socketId: socket.id
        };
        chatHistory.push(messageWithId);
        io.emit("receive-message", messageWithId);
    });

    // Drawing events
    socket.on("start-drawing", (data) => {
        socket.broadcast.emit("start-drawing", data);
    });

    socket.on("draw", (data) => {
        drawingState.push(data);
        socket.broadcast.emit("draw", data);
    });

    socket.on("end-drawing", () => {
        socket.broadcast.emit("end-drawing");
    });

    socket.on("clear-canvas", () => {
        drawingState = [];
        io.emit("clear-canvas");
    });

    // Typing race game events
    socket.on("join-race", ({ username }) => {
        console.log("User joined race:", username);
        typingPlayers.set(socket.id, {
            id: socket.id,
            username,
            progress: 0,
            wpm: 0
        });
        io.emit("player-joined", Array.from(typingPlayers.values()));
    });

    socket.on("update-progress", ({ progress, currentWpm }) => {
        const player = typingPlayers.get(socket.id);
        if (player) {
            player.progress = progress;
            player.wpm = currentWpm;
            io.emit("player-progress", {
                playerId: socket.id,
                progress,
                currentWpm
            });
        }
    });

    socket.on("race-completed", () => {
        const player = typingPlayers.get(socket.id);
        if (player) {
            player.progress = 100;
            io.emit("player-progress", {
                playerId: socket.id,
                progress: 100,
                currentWpm: player.wpm
            });
        }
    });

    socket.on("disconnect", () => {
        typingPlayers.delete(socket.id);
        io.emit("player-joined", Array.from(typingPlayers.values()));
        console.log("User disconnected:", socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
