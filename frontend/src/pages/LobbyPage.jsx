import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import socket from '../socket/socket';

export default function LobbyPage() {
    const { username, roomCode, players, setPlayers, host, setHost } = useGameStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!username || !roomCode) {
            navigate('/');
            return;
        }

        socket.connect();
        socket.emit('join_room', { roomCode, username });

        socket.on('player_joined', (newPlayer) => {
            setPlayers([...useGameStore.getState().players, newPlayer]);
        });

        socket.on('player_left', (data) => {
            const currentPlayers = useGameStore.getState().players;
            setPlayers(currentPlayers.filter(p => p.socketId !== data.socketId));
        });

        socket.on('game_started', () => {
            navigate('/game');
        });

        socket.on('host_updated', (data) => {
            setHost(data.host);
        });

        return () => {
            socket.off('player_joined');
            socket.off('player_left');
            socket.off('game_started');
            socket.off('host_updated');
        };
    }, [username, roomCode, navigate, setPlayers, setHost]);

    const displayPlayers = [{ username, isMe: true }, ...players];

    const startGame = () => {
        socket.emit('start_game', { roomCode, username });
        navigate('/game');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-3xl font-bold text-gray-800">Game Lobby</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 font-semibold">Room Code:</span>
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-mono font-bold text-2xl tracking-widest uppercase shadow-sm">
                            {roomCode}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 min-h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-700">Players</h3>
                            <span className="text-sm font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded">
                                {displayPlayers.length}/8
                            </span>
                        </div>
                        <ul className="space-y-3">
                            {displayPlayers.map((player, index) => (
                                <li key={index} className="bg-white p-3 rounded shadow-sm border border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-800">{player.username}</span>
                                        {player.username === host && (
                                            <span className="text-xl" title="Room Host">👑</span>
                                        )}
                                    </div>
                                    {player.isMe && (
                                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded font-bold">YOU</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                        <h3 className="text-lg font-bold text-gray-700 mb-4">Game Settings</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-100 shadow-sm">
                                <span className="text-gray-600 font-medium">Rounds</span>
                                <span className="font-bold text-gray-800">3</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-100 shadow-sm">
                                <span className="text-gray-600 font-medium">Draw Time</span>
                                <span className="font-bold text-gray-800">80s</span>
                            </div>
                            <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-100 shadow-sm">
                                <span className="text-gray-600 font-medium">Max Players</span>
                                <span className="font-bold text-gray-800">8</span>
                            </div>
                        </div>
                    </div>
                </div>

                {username === host ? (
                    <button 
                        onClick={startGame}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-md transition-colors text-xl shadow-md"
                    >
                        Start Game
                    </button>
                ) : (
                    <div className="w-full bg-gray-200 text-gray-600 font-bold py-4 px-4 rounded-md text-center text-xl shadow-sm border border-gray-300">
                        Waiting for Host to Start...
                    </div>
                )}
            </div>
        </div>
    );
}
