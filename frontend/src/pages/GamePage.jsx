import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';

export default function GamePage() {
    const { username } = useGameStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!username) {
            navigate('/');
        }
    }, [username, navigate]);

    return (
        <div className="flex h-screen bg-slate-100 p-4 gap-4">
            <div className="w-64 bg-white rounded-lg shadow-md p-4 flex flex-col">
                <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Players</h3>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-2 bg-blue-50 rounded mb-2 border border-blue-100">
                        <div className="font-semibold text-blue-700">{username}</div>
                        <div className="text-sm text-gray-500">0 pts</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800 tracking-widest">_ _ _ _ E _</h2>
                    <p className="text-sm text-gray-500 mt-1">Time left: 79s</p>
                </div>
                
                <div className="flex-1 bg-white rounded-lg shadow-md border-2 border-gray-200">
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Canvas Area
                    </div>
                </div>
            </div>

            <div className="w-80 bg-white rounded-lg shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <h3 className="font-bold text-gray-700">Chat</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="text-sm text-gray-500 mb-2">System: {username} joined the game.</div>
                </div>
                <div className="p-4 border-t bg-white">
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500"
                        placeholder="Type your guess here..."
                    />
                </div>
            </div>
        </div>
    );
}
