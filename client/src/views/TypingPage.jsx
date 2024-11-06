import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import foxAvatar from "../assets/fox.png";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3024"); // Adjust the URL if needed


export default function TypingPage() {
  const paragraphs = [
    "Kucing sepatu bunga terbang layang hati pelangi gelas, bulu mata pintu suara malam sarung tangga asap jendela salju hujan pelangi sapi jam meja tanah.",
    "Kursi kabut tas mobil bulan celana laut payung lilin sandal rak...",
    "Langit pintu matahari kertas sepatu pohon kaca sandal, sepeda awan piring kopi..."
  ];

  const getRandomParagraph = () => paragraphs[Math.floor(Math.random() * paragraphs.length)];

  const [text, setText] = useState(getRandomParagraph());
  const [userInput, setUserInput] = useState("");
  const [cursorPosition, setCursorPosition] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [cpm, setCpm] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Join race on mount
    socket.emit("join-race", { username: "Player 1" });

    // Listen to server events
    socket.on("player-joined", (playersList) => setPlayers(playersList));
    socket.on("player-progress", ({ playerId, progress, currentWpm }) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === playerId ? { ...player, progress, wpm: currentWpm } : player
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isGameActive) return;
      e.preventDefault();

      if (e.key === "Backspace") {
        if (cursorPosition > 0) {
          setUserInput((prev) => prev.slice(0, -1));
          setCursorPosition((prev) => prev - 1);
        }
        return;
      }

      if (cursorPosition < text.length && e.key.length === 1) {
        setUserInput((prev) => prev + e.key);
        setCursorPosition((prev) => prev + 1);

        if (e.key !== text[cursorPosition]) setTotalErrors((prev) => prev + 1);

        if (startTime) {
          const timeElapsed = (new Date() - startTime) / 1000 / 60;
          const newCpm = Math.round(cursorPosition / timeElapsed);
          setCpm(newCpm);

          // Emit typing progress to server
          const progress = calculateProgress();
          socket.emit("update-progress", { progress, currentWpm: cpm });
          console.log("Emitted Progress:", progress);
          // socket.emit("update-progress", { progress: calculateProgress(), currentWpm: newCpm });
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isGameActive, cursorPosition, text, startTime]);

  const startGame = () => {
    setText(getRandomParagraph());
    setUserInput("");
    setCursorPosition(0);
    setElapsedTime(0);
    setCpm(0);
    setStartTime(new Date());
    setIsGameActive(true);
  };

  const calculateProgress = () => {
    if (!text.length) return 0;
    const progress = Math.round((cursorPosition / text.length) * 100);
    console.log("Calculated Progress:", progress);
    return progress;
  };


  const getCharacterStyle = (index) => {
    if (index === cursorPosition) {
      return "border-l-2 border-black animate-pulse"; // Current typing position
    }
    if (index < userInput.length) {
      return userInput[index] === text[index]
        ? "text-green-600"  // Correctly typed characters
        : "text-red-600";   // Mistyped characters
    }
    return ""; // Default style for untyped characters
  };

  useEffect(() => {
    console.log("Players State Updated:", players);
  }, [players]);


  return (
    <div className="min-h-screen bg-[#A3C4C9] p-4 lg:p-8">
      <div className="flex items-center justify-between mb-4 lg:mb-8 max-w-[1400px] mx-auto">
        <button onClick={() => navigate("/")} className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg border-4 border-black font-bold">
          ← Back
        </button>

        <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>
          Type Race!
        </h1>

        <div className="w-[100px]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        {/* Players Progress Section */}
        <div className="bg-blue-200 p-4 rounded-lg border-4 border-black mb-4">
          <div className="flex flex-col gap-3">
            {players.map((player) => (
              <div key={player.id} className={`bg-white p-3 rounded-lg border-2 border-black ${player.isCurrentPlayer ? "ring-2 ring-yellow-400" : ""}`}>
                <div className="flex items-center gap-3">
                  <img src={foxAvatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-black" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-bold">{player.name}</p>
                      <p className="text-sm font-mono">{player.cpm} CPM</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 mt-1 relative">
                      <div
                        className="bg-green-500 h-full rounded-full transition-all duration-300 relative"
                        style={{ width: `${player.progress}%` }}
                      >
                        <div className="absolute -right-4 -top-1 transform -translate-y-1/4">
                          <span className={`text-xl ${player.isCurrentPlayer ? "scale-125" : ""}`}>
                            🚗
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Game Section */}
        <div className="bg-white p-6 rounded-lg border-4 border-black">
          <div className="flex justify-between mb-4">
            <div className="space-x-4">
              <span className="text-lg font-bold" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>
                {isGameActive ? `Time: ${elapsedTime.toFixed(2)}s` : `Last Time: ${elapsedTime.toFixed(2)}s`}
              </span>
              <span className="text-lg font-bold font-mono">CPM: {cpm}</span>
              <span className="text-lg font-bold font-mono text-red-600">Mistake: {totalErrors}</span>
            </div>
            <button onClick={startGame} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg border-4 border-black hover:bg-blue-600">
              {isGameActive ? "Restart" : "Start"}
            </button>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg border-4 border-black">
            <p className="text-xl leading-relaxed font-mono">
              {text.split("").map((char, index) => (
                <span key={index} className={getCharacterStyle(index)}>
                  {char}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
