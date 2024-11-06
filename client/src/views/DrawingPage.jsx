import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import foxAvatar from '../assets/fox.png';

export default function DrawingPage() {
    const location = useLocation();
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(2);
    const [tool, setTool] = useState('pencil');
    const [normalMessages, setNormalMessages] = useState([]);
    const [newNormalMessage, setNewNormalMessage] = useState('');
    const navigate = useNavigate();
    const defaultName = 'pokya';
    const { name = defaultName, item } = location.state || { name: defaultName };

    // Contoh data pemain online (nanti bisa diintegrasikan dengan backend)
    const onlinePlayers = [
        { id: 1, name: "Player 1", score: 100, isDrawing: true },
        { id: 2, name: "Player 2", score: 95 },
        { id: 3, name: "Player 3", score: 85 },
        { id: 4, name: "Player 4", score: 80 },
        { id: 5, name: "Player 5", score: 75 },
        { id: 6, name: "Player 6", score: 70 },
        { id: 7, name: "Player 7", score: 65 },
        { id: 8, name: "Player 8", score: 60 },
        { id: 9, name: "Player 9", score: 55 },
        { id: 10, name: "Player 10", score: 50 },
        { id: 11, name: "Player 11", score: 45 },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        
        // Sesuaikan ukuran canvas dengan container
        const setCanvasSize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            // Reset fill warna putih setelah resize
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            setContext(ctx);
        };

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        return () => window.removeEventListener('resize', setCanvasSize);
    }, []);

    // Update context settings setiap kali tool, color, atau size berubah
    useEffect(() => {
        if (context) {
            context.strokeStyle = tool === 'eraser' ? 'white' : color;
            context.lineWidth = brushSize;
            context.lineCap = 'round';
            context.lineJoin = 'round';
        }
    }, [tool, color, brushSize, context]);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        context.lineTo(x, y);
        context.stroke();
    };

    const stopDrawing = () => {
        context.closePath();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const isCorrectGuess = newMessage.toLowerCase().trim() === item?.toLowerCase().trim();
            setMessages([...messages, { 
                text: isCorrectGuess ? "Nah itu dia! 🎉" : newMessage, 
                sender: name || defaultName,
                isCorrect: isCorrectGuess
            }]);
            setNewMessage('');
        }
    };

    const handleNormalMessage = (e) => {
        e.preventDefault();
        if (newNormalMessage.trim()) {
            setNormalMessages([...normalMessages, { 
                text: newNormalMessage, 
                sender: name || defaultName
            }]);
            setNewNormalMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-[#A3C4C9] p-4 lg:p-8 overflow-x-hidden scrollbar-none">
            {/* Header dengan tombol kembali */}
            <div className="flex items-center justify-between mb-4 lg:mb-8 max-w-[1400px] mx-auto">
                <button 
                    onClick={() => navigate('/')}
                    className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg border-4 border-black font-bold flex items-center justify-center gap-2"
                >
                    <span>←</span> Kembali
                </button>
                
                <h1 className="text-2xl lg:text-3xl font-bold flex-1 text-center" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>
                    inkIt! Drawing Game
                </h1>
                
                {/* Elemen kosong untuk menjaga title tetap di tengah */}
                <div className="w-[100px]"></div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-[1400px] mx-auto">
                {/* Players Section - Hapus tombol kembali dari sini */}
                <div className="w-full lg:w-64 min-w-[250px]">
                    <div className="bg-blue-200 p-4 rounded-lg border-4 border-black h-[300px] lg:h-[calc(600px+4rem)] overflow-hidden">
                        <h3 className="text-lg font-bold mb-4 text-center" style={{ fontFamily: '"Press Start 2P", sans-serif' }}>
                            Players Online
                        </h3>
                        <div className="space-y-3 overflow-y-auto overflow-x-hidden scrollbar-none h-[calc(100%-4rem)]">
                            {onlinePlayers.map((player) => (
                                <div 
                                    key={player.id} 
                                    className={`bg-white p-3 rounded-lg border-2 border-black ${
                                        player.isDrawing ? 'ring-2 ring-yellow-400' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={foxAvatar} 
                                            alt="avatar" 
                                            className="w-10 h-10 rounded-full border-2 border-black"
                                        />
                                        <div>
                                            <p className="font-bold">{player.name}</p>
                                            <p className="text-sm text-gray-600">Score: {player.score}</p>
                                        </div>
                                    </div>
                                    {player.isDrawing && (
                                        <div className="mt-2 text-xs text-center bg-yellow-100 rounded-full py-1">
                                            Currently Drawing
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Drawing Section - Atur min-height untuk mobile */}
                <div className="flex-1 min-w-[300px]">
                    <div className="bg-white p-4 rounded-lg border-4 border-black h-[400px] lg:h-[calc(600px+4rem)]">
                        {/* Tools Section - Buat responsive */}
                        <div className="flex flex-wrap justify-between gap-2 mb-4">
                            <div className="flex flex-wrap gap-2">
                                <button 
                                    onClick={() => setTool('pencil')}
                                    className={`px-3 lg:px-4 py-2 rounded-lg border-4 border-black font-bold text-sm lg:text-base ${
                                        tool === 'pencil' 
                                            ? 'bg-blue-600 text-white ring-4 ring-blue-300' 
                                            : 'bg-blue-400 text-white hover:bg-blue-500'
                                    }`}
                                >
                                    ✏️ Pensil
                                </button>
                                <button 
                                    onClick={() => setTool('eraser')}
                                    className={`px-3 lg:px-4 py-2 rounded-lg border-4 border-black font-bold text-sm lg:text-base ${
                                        tool === 'eraser' 
                                            ? 'bg-red-600 text-white ring-4 ring-red-300' 
                                            : 'bg-red-400 text-white hover:bg-red-500'
                                    }`}
                                >
                                    🧹 Penghapus
                                </button>
                                <button 
                                    onClick={clearCanvas}
                                    className="bg-yellow-400 text-white px-3 lg:px-4 py-2 rounded-lg border-4 border-black hover:bg-yellow-500 font-bold"
                                >
                                    🗑️ Bersihkan
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="color" 
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-12 h-12 rounded border-4 border-black cursor-pointer"
                                />
                                <select 
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(Number(e.target.value))}
                                    className="px-4 py-2 rounded-lg border-4 border-black"
                                >
                                    <option value="2">2px</option>
                                    <option value="4">4px</option>
                                    <option value="6">6px</option>
                                    <option value="8">8px</option>
                                    <option value="10">10px</option>
                                    <option value="12">12px</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Canvas Container - Atur height responsive */}
                        <div className="h-[calc(100%-4rem)] w-full relative bg-white">
                            <div className="absolute inset-0 border-2 border-gray-300 rounded-lg">
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    className="cursor-crosshair w-full h-full rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Section - Atur width responsive */}
                <div className="w-full lg:w-96 min-w-[300px]">
                    <div className="bg-pink-200 p-4 rounded-lg border-4 border-black h-[400px] lg:h-[calc(600px+4rem)] flex flex-col">
                        <div className="bg-yellow-100 p-2 rounded-lg border-2 border-black mb-4">
                            <p className="text-center font-bold">Waktu Tersisa: 60s</p>
                        </div>
                        
                        {/* Tebakan */}
                        <div className="h-1/2 flex flex-col mb-4">
                            <div className="flex-1 overflow-y-auto bg-white rounded-lg p-4 border-2 border-black">
                                <div className="text-center font-bold mb-2 text-sm bg-yellow-100 rounded-lg py-1">
                                    Tebakan
                                </div>
                                {messages.map((message, index) => (
                                    <div key={index} className="mb-2">
                                        <span className="font-bold">{message.sender}: </span>
                                        <span className={message.isCorrect ? "text-green-600 font-bold" : ""}>
                                            {message.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Ketik tebakan..."
                                    className="flex-1 p-2 rounded-lg border-2 border-black focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="bg-green-400 text-white px-4 py-2 rounded-lg border-4 border-black hover:bg-green-500"
                                >
                                    Tebak
                                </button>
                            </form>
                        </div>

                        {/* Chat */}
                        <div className="h-1/2 flex flex-col">
                            <div className="flex-1 overflow-y-auto bg-white rounded-lg p-4 border-2 border-black">
                                <div className="text-center font-bold mb-2 text-sm bg-blue-100 rounded-lg py-1">
                                    Chat
                                </div>
                                {normalMessages.map((message, index) => (
                                    <div key={index} className="mb-2">
                                        <span className="font-bold">{message.sender}: </span>
                                        <span>{message.text}</span>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleNormalMessage} className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={newNormalMessage}
                                    onChange={(e) => setNewNormalMessage(e.target.value)}
                                    placeholder="Ketik pesan..."
                                    className="flex-1 p-2 rounded-lg border-2 border-black focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-400 text-white px-4 py-2 rounded-lg border-4 border-black hover:bg-blue-500"
                                >
                                    Kirim
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}