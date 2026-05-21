import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import useGameStore from '../store/useGameStore';
import Canvas from '../components/Canvas';
import ChatBox from '../components/ChatBox';
import Leaderboard from '../components/Leaderboard';

export default function GamePage() {
    const { 
        username, players, currentDrawer, currentRound, maxRounds, 
        timeLeft, wordLength, currentWord, gameStatus, winner, gameOverPlayers,
        setCurrentWord, setCurrentDrawer, setRoundInfo, setTimeLeft, setGameOver
    } = useGameStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!username) {
            navigate('/');
        }
    }, [username, navigate]);

    useEffect(() => {
        socket.on('turn_start', (data) => {
            setCurrentDrawer(data.drawerUsername);
            setRoundInfo(data.round, data.maxRounds, data.wordLength, data.timeLeft);
            setCurrentWord(''); 
        });

        socket.on('your_turn', (data) => {
            setCurrentWord(data.word);
        });

        socket.on('turn_end', (data) => {
            setCurrentWord(data.word);
        });

        socket.on('timer_tick', (data) => {
            setTimeLeft(data.timeLeft);
        });

        socket.on('game_over', (data) => {
            setGameOver(data.winner, data.players);
        });

        return () => {
            socket.off('turn_start');
            socket.off('your_turn');
            socket.off('turn_end');
            socket.off('timer_tick');
            socket.off('game_over');
        };
    }, [setCurrentDrawer, setRoundInfo, setCurrentWord, setTimeLeft, setGameOver]);

    if (gameStatus === 'ended') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center border border-gray-200">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Game Over!</h2>
                    <p className="text-xl text-gray-600 mb-6">Winner: <span className="font-bold text-blue-600">{winner}</span></p>
                    <div className="text-left bg-gray-50 p-4 rounded border border-gray-200">
                        <h3 className="font-bold text-gray-700 mb-3">Final Scores</h3>
                        <ul className="space-y-2">
                            {gameOverPlayers.map((p, idx) => (
                                <li key={idx} className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-gray-800">{idx + 1}. {p.username}</span>
                                    <span className="text-blue-600 font-bold">{p.score} pts</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button 
                        onClick={() => {
                            useGameStore.getState().resetGame();
                            navigate('/');
                        }} 
                        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold w-full transition-colors shadow-md"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-100 p-2 md:p-4 gap-4 max-w-screen-2xl mx-auto">

            <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center border border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-500">⏱</span>
                    <span className="text-xl font-bold text-gray-800">{timeLeft}</span>
                </div>

                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-[0.2em] md:tracking-[0.5em] uppercase">
                        {currentWord ? currentWord : Array(wordLength).fill('_').join(' ')}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-semibold">Round {currentRound} of {maxRounds}</p>
                </div>

                <div className="w-16"></div>
            </div>

            <div className="flex flex-col md:flex-row flex-1 gap-4 overflow-hidden">

                <Leaderboard />

                <div className="flex-1 flex flex-col gap-2 order-1 md:order-2 relative min-h-[300px]">
                    {username === currentDrawer ? (
                        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md z-10">
                            You are drawing!
                        </div>
                    ) : (
                        <div className="absolute top-4 left-4 bg-blue-600/80 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md z-10">
                            {currentDrawer || 'Someone'} is drawing...
                        </div>
                    )}
                    <Canvas />
                </div>

                <ChatBox />

            </div>
        </div>
    );
}
