import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import foxAvatar from '../assets/fox.png';

export default function HomePage({ base_url }) {
    const [name, setName] = useState('');
    const [language, setLanguage] = useState('English');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const handlePlayGame1 = () => {
        setIsModalOpen(true); // Open the modal when "Play Now" is clicked
    };

    const handleCategorySelect = (category) => {
        // Handle category selection, then navigate to the game page
        setIsModalOpen(false);
        navigate('/draw-guess', { state: { name, language, category } });
    };

    const handlePlayGame2 = () => {
        navigate('/quiz-show', { state: { name, language } });
    };



    return (
        <div style={{ backgroundColor: '#A3C4C9' }} className="bg-saltedegg w-full h-screen flex flex-col items-center justify-center">
            {/* Title Section */}
            <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: '"Press Start 2P", sans-serif', color: '#333' }}>
                Draw, Guess, Win!
            </h1>

            <main style={{ backgroundColor: '#A3C4C9' }} className="flex gap-10 max-w-4xl w-full p-10 bg-white rounded-lg">
                {/* Game Selection Section */}
                <section className="flex-1 bg-pink-200 border-4 border-black p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold text-center mb-4" style={{ fontFamily: '"Roboto Mono", sans-serif' }}>
                        Select Your Game
                    </h2>
                    <div className="space-y-4">
                        {/* Game Card 1 */}
                        <div className="bg-blue-200 border-4 border-black p-4 rounded-lg text-center hover:bg-blue-300 transition">
                            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>
                                Game 1: inkIt!
                            </h3>
                            <p className="text-sm mb-4" style={{ fontFamily: '"Roboto Mono", sans-serif' }}>
                                Show off your drawing skills and guess others' creations!
                            </p>
                            <button
                                onClick={handlePlayGame1}
                                className="bg-red-400 border-4 border-black py-2 px-4 rounded-lg hover:bg-red-500 transition"
                            >
                                Play Now
                            </button>
                        </div>
                        {/* Game Card 2 */}
                        <div className="bg-green-200 border-4 border-black p-4 rounded-lg text-center hover:bg-green-300 transition">
                            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>
                                Game 2: Type Race!
                            </h3>
                            <p className="text-sm mb-4" style={{ fontFamily: '"Roboto Mono", sans-serif' }}>
                                Put your knowledge to the test in this exciting quiz game!
                            </p>
                            <button
                                onClick={handlePlayGame2}
                                className="bg-red-400 border-4 border-black py-2 px-4 rounded-lg hover:bg-red-500 transition"
                            >
                                Play Now
                            </button>
                        </div>
                    </div>
                </section>

                {/* Login & Settings Section */}
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
                    <div className="flex justify-between">
                        <Link to="/rooms" className="bg-gray-200 border-4 border-black text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                            Choose Room
                        </Link>
                        <button className="bg-blue-400 border-4 border-black text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition">
                            Play Now
                        </button>
                    </div>
                </section>
            </main>
            {/* Modal for Category Selection */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white w-80 p-5 rounded-lg shadow-lg border-4 border-black">
                        <h2 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: '"Roboto Mono", sans-serif' }}>
                            Select a Category
                        </h2>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => handleCategorySelect('Animals')}
                                    className="w-full bg-blue-200 hover:bg-blue-300 py-2 rounded-lg border-2 border-black"
                                >
                                    Animals
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleCategorySelect('Food')}
                                    className="w-full bg-green-200 hover:bg-green-300 py-2 rounded-lg border-2 border-black"
                                >
                                    Food
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleCategorySelect('Places')}
                                    className="w-full bg-yellow-200 hover:bg-yellow-300 py-2 rounded-lg border-2 border-black"
                                >
                                    Places
                                </button>
                            </li>
                        </ul>
                        <button
                            onClick={() => setIsModalOpen(false)} // Close the modal
                            className="mt-4 w-full bg-red-400 hover:bg-red-500 py-2 rounded-lg border-2 border-black"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
