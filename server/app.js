const express = require("express");
const app = express();
const router = require("./routes");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const { createServer } = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(router);
app.use(errorHandler);

const roomPlayers = new Map();
const roomParagraphs = new Map();
const roomReadyPlayers = new Map();
const playerSockets = new Map();
const drawingRooms = new Map();
const gameStates = new Map();
const roomPlayerCounts = new Map();

function getOrCreateGameState(roomId) {
    if (!gameStates.has(roomId)) {
        gameStates.set(roomId, {
            isPlaying: false,
            currentDrawer: null,
            word: null,
            scores: new Map(),
            hasStarted: false,
            timeLeft: 60,
            timerInterval: null
        });
    }
    return gameStates.get(roomId);
}

function startRoundTimer(roomId, io) {
    const gameState = getOrCreateGameState(roomId);

    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    gameState.timeLeft = 60;
    io.to(roomId).emit("timer-sync", gameState.timeLeft);

    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;

        io.to(roomId).emit("timer-sync", gameState.timeLeft);

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            gameState.timerInterval = null;

            io.to(roomId).emit("time-up", {
                currentDrawer: gameState.currentDrawer?.name
            });
        }
    }, 1000);
}

function startTypingGameCountdown(roomId, io) {
    let count = 3;

    if (!roomParagraphs.has(roomId)) {
        const paragraph = getRandomParagraph();
        roomParagraphs.set(roomId, paragraph);
    }

    const countdownInterval = setInterval(() => {
        io.to(roomId).emit("game-countdown", count);
        count--;

        if (count < 0) {
            clearInterval(countdownInterval);
            const paragraph = roomParagraphs.get(roomId);
            console.log("Sending paragraph to room:", roomId, paragraph); // Debug log
            io.to(roomId).emit("game-start", paragraph);
        }
    }, 1000);
}

io.on("connection", (socket) => {
    let currentPlayerData = null;

    console.log("User connected 🎮", socket.id);

    socket.on("join-room", ({ roomId, playerData }) => {
        currentPlayerData = { roomId, ...playerData };
        socket.join(roomId);

        if (!roomPlayers.has(roomId)) {
            roomPlayers.set(roomId, new Map());
        }

        const players = roomPlayers.get(roomId);

        players.delete(playerData.name);

        players.set(playerData.name, {
            ...playerData,
            socketId: socket.id
        });

        roomPlayerCounts.set(roomId, players.size);

        io.emit("player-count-update", {
            roomId,
            count: players.size
        });

        const playersArray = Array.from(players.values());
        io.to(roomId).emit("players-update", playersArray);
    });

    socket.on("leave-room", ({ roomId, playerName }) => {
        if (roomPlayers.has(roomId)) {
            const players = roomPlayers.get(roomId);
            players.delete(playerName);

            if (roomReadyPlayers.has(roomId)) {
                roomReadyPlayers.get(roomId).delete(playerName);
            }

            roomPlayerCounts.set(roomId, players.size);

            io.emit("player-count-update", {
                roomId,
                count: players.size
            });

            const playersArray = Array.from(players.values());
            io.to(roomId).emit("players-update", playersArray);
            io.to(roomId).emit("player-left", { name: playerName });
        }
    });

    socket.on("disconnect", () => {
        if (currentPlayerData) {
            const { roomId, name } = currentPlayerData;

            if (roomPlayers.has(roomId)) {
                const players = roomPlayers.get(roomId);
                players.delete(name);

                if (roomReadyPlayers.has(roomId)) {
                    roomReadyPlayers.get(roomId).delete(name);
                }

                const newCount = players.size;
                roomPlayerCounts.set(roomId, newCount);

                io.emit("player-count-update", {
                    roomId,
                    count: newCount
                });

                const playersArray = Array.from(players.values());
                io.to(roomId).emit("players-update", playersArray);
                io.to(roomId).emit("player-left", { name });

                if (newCount === 0) {
                    roomPlayers.delete(roomId);
                    roomPlayerCounts.delete(roomId);
                    roomParagraphs.delete(roomId);
                    roomReadyPlayers.delete(roomId);
                }
            }
        }
        console.log("User disconnected 👋", socket.id);
    });

    socket.on("typing-progress", ({ roomId, playerData }) => {
        if (roomPlayers.has(roomId)) {
            roomPlayers.get(roomId).set(playerData.name, {
                ...playerData,
                socketId: socket.id
            });
        }
        socket.to(roomId).emit("player-progress", playerData);
    });

    socket.on("game-started", (roomId) => {
        io.to(roomId).emit("start-game");
    });

    socket.on("player-finished", ({ roomId, playerData }) => {
        io.to(roomId).emit("player-finished", playerData);
    });

    socket.on("request-paragraph", (roomId) => {
        let paragraph = roomParagraphs.get(roomId);

        if (!paragraph) {
            paragraph = getRandomParagraph();
            roomParagraphs.set(roomId, paragraph);
        }

        console.log("Sending paragraph on request:", roomId, paragraph); // Debug log
        socket.emit("current-paragraph", paragraph);
    });

    socket.on("new-game", ({ roomId, paragraph }) => {
        roomParagraphs.set(roomId, paragraph);
        io.to(roomId).emit("new-paragraph", paragraph);
    });

    socket.on("player-ready", ({ roomId, playerName }) => {
        console.log("Player ready received:", playerName, "for room:", roomId);

        const isDrawingRoom = drawingRooms.has(roomId);

        if (!roomReadyPlayers.has(roomId)) {
            roomReadyPlayers.set(roomId, new Set());
        }

        const readyPlayers = roomReadyPlayers.get(roomId);
        readyPlayers.add(playerName);

        io.to(roomId).emit("player-ready", { playerName });

        if (isDrawingRoom) {
            const gameState = getOrCreateGameState(roomId);
            if (!gameState.hasStarted) {
                const players = drawingRooms.get(roomId);
                const totalPlayers = players?.size || 0;

                if (readyPlayers.size === totalPlayers && totalPlayers >= 2) {
                    startGameCountdown(roomId, io);
                }
            }
        } else {
            const players = roomPlayers.get(roomId);
            if (players && readyPlayers.size === players.size && players.size >= 2) {
                startTypingGameCountdown(roomId, io);
            }
        }
    });

    socket.on("player-unready", ({ roomId, playerName }) => {
        console.log("Player unready received:", playerName, "for room:", roomId);

        const isDrawingRoom = drawingRooms.has(roomId);
        const gameState = isDrawingRoom ? gameStates.get(roomId) : null;

        if ((!isDrawingRoom || !gameState?.isPlaying) && roomReadyPlayers.has(roomId)) {
            roomReadyPlayers.get(roomId).delete(playerName);
            console.log("Current ready players:", Array.from(roomReadyPlayers.get(roomId)));
            io.to(roomId).emit("player-unready", { playerName });
        }
    });

    socket.on("game-finish", ({ roomId }) => {
        const isDrawingRoom = drawingRooms.has(roomId);

        if (isDrawingRoom) {
            const gameState = getOrCreateGameState(roomId);
            gameState.isPlaying = false;
            gameState.hasStarted = false;
            gameState.currentDrawer = null;
            gameState.word = null;
        }

        roomReadyPlayers.set(roomId, new Set());
        io.to(roomId).emit("game-reset");
    });

    socket.on("join-drawing-room", ({ roomId, playerData }) => {
        socket.join(roomId);

        if (!drawingRooms.has(roomId)) {
            drawingRooms.set(roomId, new Map());
        }

        const players = drawingRooms.get(roomId);
        playerData.socketId = socket.id;
        playerData.score = playerData.score || 0;
        players.set(playerData.name, playerData);

        roomPlayerCounts.set(roomId, players.size);

        io.emit("player-count-update", {
            roomId,
            count: players.size
        });

        const gameState = getOrCreateGameState(roomId);

        socket.emit("game-state-sync", {
            isPlaying: gameState.isPlaying,
            currentDrawer: gameState.currentDrawer,
            word: gameState.word,
            hasStarted: gameState.hasStarted,
            timeLeft: gameState.timeLeft
        });

        const readyPlayers = Array.from(roomReadyPlayers.get(roomId) || new Set());
        socket.emit("ready-players-sync", readyPlayers);

        io.to(roomId).emit("player-joined", playerData);
        io.to(roomId).emit("drawing-players-update", Array.from(players.values()));
    });

    socket.on("select-word", ({ roomId, word, drawer }) => {
        const gameState = getOrCreateGameState(roomId);
        if (gameState && gameState.currentDrawer?.name === drawer) {
            gameState.word = word;

            startRoundTimer(roomId, io);

            io.to(roomId).emit("word-selected", {
                word,
                drawer
            });

            io.to(roomId).emit("game-state-update", {
                currentDrawer: gameState.currentDrawer,
                word: word
            });
        }
    });

    socket.on("next-turn", ({ roomId }) => {
        console.log("Next turn requested for room:", roomId);

        const players = drawingRooms.get(roomId);
        const gameState = gameStates.get(roomId);

        if (players && gameState?.isPlaying) {
            const playersArray = Array.from(players.values());
            const currentIndex = playersArray.findIndex(
                p => p.name === gameState.currentDrawer?.name
            );

            const nextIndex = (currentIndex + 1) % playersArray.length;
            const nextDrawer = playersArray[nextIndex];

            if (nextDrawer) {
                console.log("Moving to next drawer:", nextDrawer.name);

                gameState.currentDrawer = nextDrawer;
                gameState.word = null;

                io.to(roomId).emit("canvas-clear");

                io.to(roomId).emit("reset-timer");

                io.to(roomId).emit("game-state-update", {
                    currentDrawer: nextDrawer,
                    word: null
                });
            }
        }
    });

    socket.on("drawing-data", ({ roomId, ...drawingData }) => {
        socket.to(roomId).emit("drawing-data", drawingData);
    });

    socket.on("drawing-chat", ({ roomId, messageData, playerName, isCorrect }) => {
        if (drawingRooms.has(roomId)) {
            const players = drawingRooms.get(roomId);
            const player = players.get(playerName);

            if (isCorrect && player) {
                if (!player.score) player.score = 0;
                player.score += 15;
                players.set(playerName, player);

                console.log(`Player ${playerName} score updated to: ${player.score}`); // Debug log

                io.to(roomId).emit("drawing-players-update",
                    Array.from(players.values())
                );
            }

            io.to(roomId).emit("drawing-chat", messageData);
        }
    });

    socket.on("canvas-clear", ({ roomId }) => {
        const gameState = getOrCreateGameState(roomId);

        if (gameState.currentDrawer?.socketId === socket.id) {
            socket.to(roomId).emit("canvas-clear");
        }
    });

    socket.on("leave-drawing-room", ({ roomId, playerName }) => {
        if (drawingRooms.has(roomId)) {
            const players = drawingRooms.get(roomId);
            players.delete(playerName);

            const newCount = players.size;
            roomPlayerCounts.set(roomId, newCount);

            io.emit("player-count-update", {
                roomId,
                count: newCount
            });

            io.to(roomId).emit("player-left", { name: playerName });
            io.to(roomId).emit("drawing-players-update",
                Array.from(players.values())
            );

            if (newCount === 0) {
                drawingRooms.delete(roomId);
                roomPlayerCounts.delete(roomId);
                gameStates.delete(roomId);
                roomReadyPlayers.delete(roomId);
            }
        }
    });

    socket.on("time-up", ({ roomId, currentDrawer }) => {
        console.log("⏰ Time up event received for room:", roomId, "drawer:", currentDrawer);

        socket.emit("time-up-ack", { received: true, currentDrawer });

        const players = drawingRooms.get(roomId);
        const currentGameState = gameStates.get(roomId);

        console.log("Current game state:", {
            hasPlayers: !!players,
            isPlaying: currentGameState?.isPlaying,
            currentDrawer: currentGameState?.currentDrawer?.name
        });

        if (players && currentGameState?.isPlaying) {
            const playersArray = Array.from(players.values());
            console.log("Players in room:", playersArray.map(p => p.name));

            const currentIndex = playersArray.findIndex(
                p => p.name === currentDrawer
            );
            console.log("Current drawer index:", currentIndex);

            const nextIndex = (currentIndex + 1) % playersArray.length;
            const nextDrawer = playersArray[nextIndex];

            if (nextDrawer) {
                console.log("Moving to next drawer:", nextDrawer.name);

                currentGameState.currentDrawer = nextDrawer;
                currentGameState.word = null;

                io.to(roomId).emit("canvas-clear");
                console.log("Canvas clear emitted");

                io.to(roomId).emit("reset-timer");
                console.log("Timer reset emitted");

                io.to(roomId).emit("game-state-update", {
                    currentDrawer: nextDrawer,
                    word: null
                });
                console.log("Game state update emitted for new drawer:", nextDrawer.name);
            }
        }
    });

    console.log("🔌 New socket connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("🔌 Socket disconnected:", socket.id);
    });

    socket.on("request-room-counts", () => {
        const counts = {};
        roomPlayerCounts.forEach((count, roomId) => {
            counts[roomId] = count;
        });
        socket.emit("initial-room-counts", counts);
    });
});

function getRandomParagraph() {
    const paragraphs = [
        "Kucing berlari mengejar bola merah di taman yang indah sambil melompat-lompat dengan riang gembira.",
        "Awan putih berarak di langit biru, burung-burung berkicau merdu menyambut pagi yang cerah.",
        "Pohon mangga di halaman rumah berbuah lebat, anak-anak berebut memanjat untuk memetik buahnya.",
        "Pantai yang tenang dihiasi ombak kecil, pasir putih berkilau ditimpa sinar matahari sore.",
        "Gunung tinggi menjulang ke langit, kabut tipis menyelimuti puncaknya yang dingin dan sejuk."
    ];
    return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

function startGameCountdown(roomId, io) {
    const gameState = getOrCreateGameState(roomId);
    if (gameState.hasStarted) return;

    gameState.hasStarted = true;
    let count = 3;

    io.to(roomId).emit("game-countdown", count);

    const countdownInterval = setInterval(() => {
        count--;

        if (count > 0) {
            io.to(roomId).emit("game-countdown", count);
        } else {
            clearInterval(countdownInterval);

            gameState.isPlaying = true;
            const players = Array.from(drawingRooms.get(roomId).values());
            gameState.currentDrawer = players[0];

            io.to(roomId).emit("game-start");
            io.to(roomId).emit("game-state-update", {
                currentDrawer: gameState.currentDrawer,
                word: null
            });

            startRoundTimer(roomId, io);
        }
    }, 1000);
}



httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});
