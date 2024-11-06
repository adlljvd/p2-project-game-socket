import { useState, useEffect } from 'react';

export default function TypingPage() {
    const [textToType, setTextToType] = useState("The quick brown fox jumps over the lazy dog");
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isGameActive, setIsGameActive] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);

    // Start the game
    const startGame = () => {
        setUserInput("");
        setElapsedTime(0);
        setStartTime(new Date());
        setIsGameActive(true);
    };

    // Handle input change
    const handleInputChange = (e) => {
        setUserInput(e.target.value);

        // Check if the user has completed the typing
        if (e.target.value === textToType) {
            const endTime = new Date();
            const timeTaken = (endTime - startTime) / 1000;
            setElapsedTime(timeTaken);
            setIsGameActive(false);
            updateLeaderboard(timeTaken);
        }
    };

    // Update leaderboard
    const updateLeaderboard = (time) => {
        const newEntry = { name: "Player 1", time }; // Replace "Player 1" with actual player name
        setLeaderboard((prevLeaderboard) => [...prevLeaderboard, newEntry].sort((a, b) => a.time - b.time));
    };

    return (
        <div className="bg-saltedegg min-h-screen flex flex-col items-center justify-center">
            {/* Game Title */}
            <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: '"Press Start 2P", sans-serif', color: '#333' }}>
                Typing Race
            </h1>

            {/* Main Game Container */}
            <div className="bg-white border-4 border-black w-11/12 max-w-3xl p-6 rounded-lg flex flex-col items-center">
                {/* Word to Type */}
                <div className="bg-yellow-200 border-4 border-black w-full text-center p-4 rounded-lg mb-4">
                    <p className="text-2xl font-semibold" style={{ fontFamily: '"Roboto Mono", sans-serif' }}>{textToType}</p>
                </div>

                {/* Input Box */}
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    disabled={!isGameActive}
                    placeholder="Type here..."
                    className="w-full p-3 border-4 border-black rounded-lg mb-4 focus:outline-none"
                    style={{ fontFamily: '"Roboto Mono", sans-serif' }}
                />

                {/* Timer and Start Button */}
                <div className="flex justify-between w-full mb-4">
                    <p className="text-lg font-bold" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>
                        {isGameActive ? `Time: ${elapsedTime.toFixed(2)}s` : `Your Time: ${elapsedTime.toFixed(2)}s`}
                    </p>
                    <button
                        onClick={startGame}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg border-4 border-black hover:bg-blue-600 transition"
                    >
                        {isGameActive ? "Restart" : "Start"}
                    </button>
                </div>

                {/* Leaderboard */}
                <div className="bg-pink-200 border-4 border-black w-full p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>Leaderboard</h2>
                    <ul>
                        {leaderboard.map((entry, index) => (
                            <li key={index} className="flex justify-between p-2 bg-white border-b-2 border-black rounded-lg mb-2">
                                <span>{entry.name}</span>
                                <span>{entry.time.toFixed(2)}s</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
