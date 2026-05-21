import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';

export default function HomePage() {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    
    const setUsername = useGameStore((state) => state.setUsername);
    const setRoomCode = useGameStore((state) => state.setRoomCode);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/rooms/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to create room');
                return;
            }

            setUsername(name);
            setRoomCode(data.room.roomCode);
            navigate('/lobby');
        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !code.trim()) {
            setError('Please enter both name and room code');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/rooms/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: name, roomCode: code })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to join room');
                return;
            }

            setUsername(name);
            setRoomCode(data.room.roomCode);
            navigate('/lobby');
        } catch (err) {
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
            <h1 className="text-5xl font-bold text-blue-600 mb-8">Skribbl Clone</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-md outline-none focus:border-blue-500"
                        placeholder="Enter your name"
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <button 
                        onClick={handleCreateRoom}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
                    >
                        Create New Game
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md outline-none focus:border-green-500 uppercase"
                            placeholder="Room Code"
                            maxLength={4}
                        />
                        <button 
                            onClick={handleJoinRoom}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition-colors"
                        >
                            Join
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
