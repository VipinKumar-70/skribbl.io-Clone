import { useRef, useState, useEffect } from 'react';
import socket from '../socket/socket';
import useGameStore from '../store/useGameStore';

export default function Canvas() {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const prevPos = useRef({ x: 0, y: 0 });

    const { roomCode, username, currentDrawer } = useGameStore();
    const isDrawer = username === currentDrawer;

    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;

        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;

        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.lineJoin = 'round';

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        contextRef.current = context;
        saveSnapshot();

        const handleDraw = ({ x, y, prevX, prevY, color: incomingColor, brushSize: incomingSize }) => {
            const ctx = contextRef.current;
            if (!ctx) return;

            const prevStrokeStyle = ctx.strokeStyle;
            const prevLineWidth = ctx.lineWidth;

            ctx.strokeStyle = incomingColor;
            ctx.lineWidth = incomingSize;

            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();

            ctx.strokeStyle = prevStrokeStyle;
            ctx.lineWidth = prevLineWidth;
        };

        socket.on('draw', handleDraw);

        return () => {
            socket.off('draw', handleDraw);
        };
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = brushSize;
        }
    }, [color, brushSize]);

    const saveSnapshot = () => {
        const canvas = canvasRef.current;
        setHistory(prev => [...prev, canvas.toDataURL()]);
    };

    const startDrawing = ({ nativeEvent }) => {
        if (!isDrawer) return;
        const { offsetX, offsetY } = nativeEvent;
        prevPos.current = { x: offsetX, y: offsetY };
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing || !isDrawer) return;
        const { offsetX, offsetY } = nativeEvent;

        contextRef.current.beginPath();
        contextRef.current.moveTo(prevPos.current.x, prevPos.current.y);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        socket.emit('draw', {
            roomCode,
            x: offsetX,
            y: offsetY,
            prevX: prevPos.current.x,
            prevY: prevPos.current.y,
            color,
            brushSize
        });

        prevPos.current = { x: offsetX, y: offsetY };
    };

    const stopDrawing = () => {
        if (!isDrawing || !isDrawer) return;
        setIsDrawing(false);
        saveSnapshot();
    };

    const clearCanvas = () => {
        if (!isDrawer) return;
        const canvas = canvasRef.current;
        const context = contextRef.current;
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        saveSnapshot();
    };

    const undo = () => {
        if (!isDrawer) return;
        if (history.length <= 1) return; 

        const newHistory = [...history];
        newHistory.pop(); 
        const previousState = newHistory[newHistory.length - 1];
        setHistory(newHistory);

        const canvas = canvasRef.current;
        const context = contextRef.current;
        const img = new Image();
        img.src = previousState;
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    };

    return (
        <div className="flex flex-col w-full h-full gap-2">
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full h-full">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="cursor-crosshair touch-none"
                />
            </div>

            {isDrawer && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 flex items-center justify-center gap-4 overflow-x-auto">
                    <div className="flex gap-2 border-r pr-4">
                        <button onClick={() => setColor('#000000')} className="w-8 h-8 rounded-full bg-black border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                        <button onClick={() => setColor('#ef4444')} className="w-8 h-8 rounded-full bg-red-500 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                        <button onClick={() => setColor('#3b82f6')} className="w-8 h-8 rounded-full bg-blue-500 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                        <button onClick={() => setColor('#22c55e')} className="w-8 h-8 rounded-full bg-green-500 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                        <button onClick={() => setColor('#facc15')} className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                        <button onClick={() => setColor('#ffffff')} className="w-8 h-8 rounded bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <span className="text-xs text-gray-500 font-bold px-1">ERASE</span>
                        </button>
                    </div>

                    <div className="flex gap-2 items-center border-r pr-4">
                        <button onClick={() => setBrushSize(2)} className="w-4 h-4 rounded-full bg-gray-400 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                        <button onClick={() => setBrushSize(5)} className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                        <button onClick={() => setBrushSize(12)} className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                    </div>

                    <div className="flex gap-2 pl-2">
                        <button onClick={undo} className="bg-gray-100 text-gray-700 px-3 py-2 rounded font-bold hover:bg-gray-200 text-sm transition-colors border border-gray-200">
                            Undo
                        </button>
                        <button onClick={clearCanvas} className="bg-red-100 text-red-600 px-3 py-2 rounded font-bold hover:bg-red-200 text-sm transition-colors border border-red-200">
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
