import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { io } from "socket.io-client";
import foxAvatar from "../assets/fox.png";

const socket = io("http://localhost:3024");

export default function DrawingPage() {
  const location = useLocation();
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [tool, setTool] = useState("pencil");
  const [normalMessages, setNormalMessages] = useState([]);
  const [newNormalMessage, setNewNormalMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { name = "pokya", item } = location.state || { name: "pokya" };

  const itemsToDraw = ["Dog", "Cat"];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setCanvasSize = () => {
      const { width, height } = canvas.parentElement.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    setContext(ctx);

    socket.off("start-drawing").on("start-drawing", ({ x, y }) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    socket.off("draw").on("draw", ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    socket.off("end-drawing").on("end-drawing", () => {
      ctx.closePath();
    });

    socket.off("clear-canvas").on("clear-canvas", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    socket.off("receive-room-message").on("receive-room-message", (message) => {
      setNormalMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socket.emit("start-drawing", { x: offsetX, y: offsetY });
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
    socket.emit("draw", { x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    context.closePath();
    setIsDrawing(false);
    socket.emit("end-drawing");
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket.emit("clear-canvas");
  };

  const handleNormalMessage = (e) => {
    e.preventDefault();
    if (newNormalMessage.trim()) {
      const messageData = { text: newNormalMessage, sender: name };

      socket.emit("send-room-message", messageData);
      setNewNormalMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#A3C4C9] p-4 lg:p-8 overflow-x-hidden scrollbar-none">
      <div className="flex items-center justify-between mb-4 lg:mb-8 max-w-[1400px] mx-auto">
        <Link
          to="/"
          className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg border-4 border-black font-bold flex items-center justify-center gap-2"
        >
          <span>←</span> Back
        </Link>
        <h1
          className="text-2xl lg:text-3xl font-bold flex-1 text-center"
          style={{ fontFamily: '"Press Start 2P", sans-serif' }}
        >
          inkIt! - {selectedItem ? `Drawing: ${selectedItem}` : "Please select"}
        </h1>
        <div className="w-[100px]"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-[1400px] mx-auto">
        <div className="w-full lg:w-64 min-w-[250px]">
          <div className="bg-blue-200 p-4 rounded-lg border-4 border-black h-[300px] lg:h-[calc(600px+4rem)] overflow-hidden">
            <h3
              className="text-lg font-bold mb-4 text-center"
              style={{ fontFamily: '"Press Start 2P", sans-serif' }}
            >
              Players Online
            </h3>
          </div>
        </div>

        <div className="flex-1 min-w-[300px]">
          <div className="bg-white p-4 rounded-lg border-4 border-black h-[400px] lg:h-[calc(600px+4rem)]">
            <div className="flex flex-wrap justify-between gap-2 mb-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTool("pencil")}
                  className={`px-3 lg:px-4 py-2 rounded-lg border-4 border-black font-bold text-sm lg:text-base ${
                    tool === "pencil"
                      ? "bg-blue-600 text-white ring-4 ring-blue-300"
                      : "bg-blue-400 text-white hover:bg-blue-500"
                  }`}
                >
                  ✏️ Pencil
                </button>
                <button
                  onClick={() => setTool("eraser")}
                  className={`px-3 lg:px-4 py-2 rounded-lg border-4 border-black font-bold text-sm lg:text-base ${
                    tool === "eraser"
                      ? "bg-red-600 text-white ring-4 ring-red-300"
                      : "bg-red-400 text-white hover:bg-red-500"
                  }`}
                >
                  🧹 Eraser
                </button>
                <button
                  onClick={clearCanvas}
                  className="bg-yellow-400 text-white px-3 lg:px-4 py-2 rounded-lg border-4 border-black hover:bg-yellow-500 font-bold"
                >
                  🗑️ Reset
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

        <div className="w-full lg:w-96 min-w-[300px]">
          <div className="bg-pink-200 p-4 rounded-lg border-4 border-black h-[400px] lg:h-[calc(600px+4rem)] flex flex-col">
            <div className="h-1/2 flex flex-col mb-4">
              <div className="flex-1 overflow-y-auto bg-white rounded-lg p-4 border-2 border-black">
                <div className="text-center font-bold mb-2 text-sm bg-yellow-100 rounded-lg py-1">
                  Guess
                </div>
                {messages.map((message, index) => (
                  <div key={index} className="mb-2">
                    <span className="font-bold">{message.sender}: </span>
                    <span
                      className={
                        message.isCorrect ? "text-green-600 font-bold" : ""
                      }
                    >
                      {message.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

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
                  placeholder="Send message..."
                  className="flex-1 p-2 rounded-lg border-2 border-black focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-400 text-white px-4 py-2 rounded-lg border-4 border-black hover:bg-blue-500"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
