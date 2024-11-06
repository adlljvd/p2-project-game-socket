
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import foxAvatar from '../assets/fox.png';

export default function HomePage({ base_url }) {
    const [name, setName] = useState('');
    const [language, setLanguage] = useState('ID');
    const [selectedGame, setSelectedGame] = useState(null);
    const navigate = useNavigate();

    // Handle Play Now Button Click
    const handlePlayNow = () => {
        if (name && selectedGame) {
            const gamePath = selectedGame === 'drawing-game' ? '/drawing-game' : '/typing-game';
            navigate(gamePath, { state: { name, language } });
        }
    };

    // Handle Game Selection
    const selectGame = (game) => {
        setSelectedGame(game); // Set the selected game
    };

    return (
        <div style={{ backgroundColor: '#A3C4C9' }} className="bg-saltedegg w-full h-screen flex flex-col items-center justify-center">
            {/* Title Section */}
            <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: '"Press Start 2P", sans-serif', color: '#333' }}>
                Draw, Type, Win!
            </h1>

            <main style={{ backgroundColor: '#A3C4C9' }} className="flex gap-10 max-w-4xl w-full p-10 bg-white rounded-lg">
                {/* Game Selection Section */}
                <section className="flex-1 bg-pink-200 border-4 border-black p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold text-center mb-4" style={{ fontFamily: '"Roboto Mono", sans-serif' }}>
                        Select Your Game
                    </h2>
                    <div className="space-y-4">
                        {/* Game Card 1 */}
                        <div
                            onClick={() => selectGame('drawing-game')}
                            className={`bg-blue-200 border-4 border-black p-4 rounded-lg text-center cursor-pointer transform transition-transform hover:scale-105 ${selectedGame === 'drawing-game' ? 'ring-4 ring-blue-400' : ''}`}
                        >
                            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>
                                Game 1: inkIt!
                            </h3>
                            <p className="text-sm mb-4" style={{ fontFamily: '"Roboto Mono", sans-serif' }}>
                                Show off your drawing skills and guess others' creations!
                            </p>
                        </div>
                        {/* Game Card 2 */}
                        <div
                            onClick={() => selectGame('typing-game')}
                            className={`bg-green-200 border-4 border-black p-4 rounded-lg text-center cursor-pointer transform transition-transform hover:scale-105 ${selectedGame === 'typing-game' ? 'ring-4 ring-green-400' : ''}`}
                        >
                            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>
                                Game 2: Typing Race!
                            </h3>
                            <p className="text-sm mb-4" style={{ fontFamily: '"Roboto Mono", sans-serif' }}>
                                Put your typing skill and win the race!
                            </p>
                        </div>
                    </div>
                </section>

                {/* Profile & Settings Section */}
                <section className="flex-1 bg-yellow-200 border-4 border-black p-6 rounded-lg">
                    <div className="text-center mb-6">
                        <img src={foxAvatar} alt="Avatar" className="w-20 h-20 mx-auto rounded-full border-4 border-black mb-4" />
                        <p className="text-black font-bold" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>
                            Avatar
                        </p>
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border-4 border-black rounded-lg focus:outline-none"
                        />
                    </div>
                    <div className="mb-6">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-3 border-4 border-black rounded-lg focus:outline-none"
                        >
                            <option>Bahasa Indonesia</option>
                        </select>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={handlePlayNow}
                            disabled={!name || !selectedGame}
                            className={`bg-blue-400 border-4 border-black text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition ${!name || !selectedGame ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Play Now
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}