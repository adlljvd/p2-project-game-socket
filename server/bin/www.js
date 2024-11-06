const http = require('http');
const { Server } = require('socket.io');
const app = require('../app');

const PORT = 3024; // Hardcoded URL, tidak menggunakan process.env
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Hardcoded URL
        methods: ["GET", "POST"]
    }
});

let drawingState = [];
let chatHistory = [];
let typingPlayers = new Map();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Mengirimkan status gambar dan chat history saat user bergabung
    socket.emit("drawing-state", drawingState);
    socket.emit("chat-history", chatHistory);

    socket.on("send-message", (messageData) => {
        const messageWithId = {
            ...messageData,
            id: Date.now(),
            socketId: socket.id
        };
        chatHistory.push(messageWithId);
        io.emit("receive-message", messageWithId);
    });

    // Event untuk menggambar real-time
    socket.on("start-drawing", (data) => {
        drawingState.push(data); // Menyimpan posisi awal drawing
        socket.broadcast.emit("start-drawing", data);
    });

    socket.on("draw", (data) => {
        drawingState.push(data); // Menyimpan garis yang digambar
        socket.broadcast.emit("draw", data);
    });

    socket.on("end-drawing", () => {
        socket.broadcast.emit("end-drawing");
    });

    socket.on("clear-canvas", () => {
        drawingState = []; // Reset state gambar
        io.emit("clear-canvas");
    });

    // Chat Room untuk Drawing Game
    socket.on("send-room-message", (messageData) => {
        const messageWithId = {
            ...messageData,
            id: Date.now(),
            socketId: socket.id
        };
        chatHistory.push(messageWithId); // Menyimpan pesan di history
        io.emit("receive-room-message", messageWithId); // Emit pesan ke semua user di room
    });

    // Untuk Typing Race tetap seperti semula, tidak diubah
    socket.on("join-race", ({ username }) => {
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
    console.log(`Server berjalan di port ${PORT}`);
});
