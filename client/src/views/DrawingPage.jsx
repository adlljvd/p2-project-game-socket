import { useState } from 'react';
import foxAvatar from '../assets/fox.png';
import { Link } from 'react-router-dom';


export default function DrawGuessGame() {
    const [chatMessage, setChatMessage] = useState('');
    const [guess, setGuess] = useState('');
    const [activeTab, setActiveTab] = useState('answer'); // 'answer' or 'chat'

    return (
        <div className="bg-saltedegg min-h-screen flex items-center justify-center">
            {/* Main Game Container */}
            <div className="bg-white border-4 border-black w-11/12 max-w-5xl p-4 rounded-lg relative">

                {/* Close Button */}
                <Link to='/' className="absolute top-4 right-4 text-black font-bold text-2xl">×</Link>

                <div className="flex">

                    {/* Player List */}
                    <div className="w-1/4 bg-pink-200 border-r-4 border-black p-4 rounded-lg">
                        <h2 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>Players</h2>
                        <ul className="space-y-2">
                            {['pcy', 'ASLICIMAHI', 'semar', 'Maskij', 'superrrcooo', 'Salas', 'Duyeh14'].map((player, index) => (
                                <li key={index} className="flex items-center p-2 border-b-2 border-black">
                                    <img src={foxAvatar} alt="Avatar" className="w-10 h-10 rounded-full mr-2 border-2 border-black" />
                                    <div>
                                        <p className="font-bold text-sm" style={{ fontFamily: '"Roboto Mono", sans-serif' }}>{player}</p>
                                        <p className="text-xs text-gray-700">{Math.floor(Math.random() * 100)} points</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col items-center p-6">

                        {/* Drawing Canvas Area */}
                        <div className="w-full bg-yellow-200 border-4 border-black p-4 rounded-lg mb-4 relative">
                            <h2 className="text-lg font-bold text-center mb-2" style={{ fontFamily: '"Roboto Mono", sans-serif' }}>Drawing Area</h2>
                            <div className="w-full h-64 bg-white border-4 border-black rounded-lg flex items-center justify-center">
                                <p className="text-gray-500">Canvas Placeholder</p>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-4 bg-gray-300 rounded-full mt-4">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
                            </div>
                        </div>

                        {/* Answer and Chat Tabs */}
                        <div className="w-full flex bg-white border-4 border-black rounded-lg overflow-hidden mb-2">
                            {/* Tabs */}
                            <button
                                onClick={() => setActiveTab('answer')}
                                className={`flex-1 text-center py-2 font-bold ${activeTab === 'answer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                style={{ fontFamily: '"Press Start 2P", sans-serif' }}
                            >
                                Answer
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`flex-1 text-center py-2 font-bold ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                style={{ fontFamily: '"Press Start 2P", sans-serif' }}
                            >
                                Chat
                            </button>
                        </div>

                        {/* Answer/Chat Section */}
                        <div className="w-full bg-gray-100 border-4 border-black rounded-lg p-4">
                            {activeTab === 'answer' ? (
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={guess}
                                        onChange={(e) => setGuess(e.target.value)}
                                        placeholder="Type your guess..."
                                        className="w-full p-3 border-4 border-black rounded-lg focus:outline-none"
                                        style={{ fontFamily: '"Roboto Mono", sans-serif' }}
                                    />
                                    <button className="ml-4 bg-red-400 text-white font-bold py-2 px-4 rounded-lg border-4 border-black hover:bg-red-500 transition">
                                        Submit
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="h-32 overflow-y-auto bg-white border-4 border-black rounded-lg mb-2 p-2">
                                        <p className="text-gray-500 text-center">No messages yet...</p>
                                    </div>
                                    <input
                                        type="text"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full p-3 border-4 border-black rounded-lg focus:outline-none"
                                        style={{ fontFamily: '"Roboto Mono", sans-serif' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
