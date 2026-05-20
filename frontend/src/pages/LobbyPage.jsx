import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import socket from '../socket/socket';

export default function LobbyPage() {
    const { username, roomCode } = useGameStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!username) {
            navigate('/');
        }
    }, [username, navigate]);

    const startGame = () => {
        navigate('/game');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Game Lobby</h2>
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-mono font-bold text-xl tracking-widest">
                        {roomCode || 'WAIT'}
                    </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 min-h-[200px]">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Players (1/8)</h3>
                    <ul className="space-y-2">
                        <li className="bg-white p-3 rounded shadow-sm border border-gray-100 flex items-center">
                            <span className="font-bold text-blue-600 mr-2">{username}</span>
                            <span className="text-gray-500 text-sm">(You)</span>
                        </li>
                    </ul>
                </div>

                <button 
                    onClick={startGame}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-md transition-colors text-lg"
                >
                    Start Game
                </button>
            </div>
        </div>
    );
}
