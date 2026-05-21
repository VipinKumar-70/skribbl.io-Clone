import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';

export default function GamePage() {
    const { username, players } = useGameStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!username) {
            navigate('/');
        }
    }, [username, navigate]);

    const allPlayers = [{ username, score: 0, isMe: true }, ...players];

    return (
        <div className="flex flex-col h-screen bg-slate-100 p-2 md:p-4 gap-4 max-w-screen-2xl mx-auto">
            
            <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center border border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-500">⏱</span>
                    <span className="text-xl font-bold text-gray-800">79</span>
                </div>
                
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-[0.2em] md:tracking-[0.5em] uppercase">
                        _ _ a p p l _
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-semibold">Round 1 of 3</p>
                </div>
                
                <div className="w-16"></div>
            </div>

            <div className="flex flex-col md:flex-row flex-1 gap-4 overflow-hidden">
                
                <div className="w-full md:w-64 bg-white rounded-lg shadow-sm flex flex-col border border-gray-200 order-2 md:order-1 h-48 md:h-auto">
                    <div className="p-3 border-b bg-gray-50 rounded-t-lg">
                        <h3 className="font-bold text-gray-700">Players</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {allPlayers.map((player, idx) => (
                            <div key={idx} className={`p-2 rounded flex justify-between items-center ${player.isMe ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'}`}>
                                <div className="flex flex-col">
                                    <span className={`font-bold ${player.isMe ? 'text-blue-700' : 'text-gray-700'}`}>
                                        {player.username}
                                    </span>
                                    <span className="text-xs text-gray-500">#{idx + 1}</span>
                                </div>
                                <span className="font-bold text-gray-800">{player.score} pts</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-2 order-1 md:order-2">
                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center relative min-h-[300px]">
                        
                        <div className="text-gray-400 font-semibold text-lg border-2 border-dashed border-gray-300 p-8 rounded">
                            Canvas Area (Logic Pending)
                        </div>
                        
                        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                            Alex is drawing...
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 flex items-center justify-center gap-4 overflow-x-auto">
                        <div className="flex gap-2 border-r pr-4">
                            <button className="w-8 h-8 rounded-full bg-black border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                            <button className="w-8 h-8 rounded-full bg-red-500 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                            <button className="w-8 h-8 rounded-full bg-blue-500 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                            <button className="w-8 h-8 rounded-full bg-green-500 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                            <button className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-gray-300 hover:scale-110 transition-transform"></button>
                            <button className="w-8 h-8 rounded bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                <span className="text-xs text-gray-500 font-bold px-1">ERASE</span>
                            </button>
                        </div>
                        
                        <div className="flex gap-2 items-center">
                            <button className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                            <button className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                            <button className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white shadow-sm hover:scale-110 transition-transform"></button>
                        </div>

                        <div className="flex gap-2 border-l pl-4">
                            <button className="bg-red-100 text-red-600 px-3 py-2 rounded font-bold hover:bg-red-200 text-sm transition-colors border border-red-200">
                                Clear Canvas
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-80 bg-white rounded-lg shadow-sm flex flex-col border border-gray-200 order-3 h-64 md:h-auto">
                    <div className="p-3 border-b bg-gray-50 rounded-t-lg">
                        <h3 className="font-bold text-gray-700">Chat & Guesses</h3>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto space-y-2">
                        <div className="text-sm font-bold text-blue-500 bg-blue-50 p-2 rounded border border-blue-100">System: The game has started!</div>
                        <div className="text-sm text-gray-700 p-1"><span className="font-bold">Vipin:</span> tree</div>
                        <div className="text-sm text-gray-700 p-1"><span className="font-bold">Alex:</span> flower</div>
                        <div className="text-sm font-bold text-green-600 bg-green-50 p-2 rounded border border-green-100">Alex guessed the word!</div>
                    </div>
                    <div className="p-3 border-t bg-gray-50 rounded-b-lg">
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 p-3 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow text-sm shadow-inner"
                            placeholder="Type your guess..."
                        />
                    </div>
                </div>
                
            </div>
        </div>
    );
}
